import fs from 'fs';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const WB_API_BASE_URL = 'https://feedbacks-api.wildberries.ru/api/v1';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getReviews = async (req, res) => {
  try {
    const apiKey = req.headers.authorization;

    const { data } = await axios.get(`https://feedbacks-api.wildberries.ru/api/v1/feedbacks`, {
      headers: { 'Authorization': apiKey },
      params: {
        isAnswered: false,
        take: 5000,
        skip: 0
      }
    });

    res.json(data);
  } catch (err) {
    console.error('Ошибка при получении отзывов:', err);
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
};

export const setAnswersonReviews = async (req, res) => {
  const { apiKey, reviewIds, responses, marketName, contacts } = req.body;

  try {
    const { data: responseData } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
      headers: { Authorization: apiKey },
      params: {
        isAnswered: false,
        take: 5000,
        skip: 0,
      },
    });

    const allFeedbacks = responseData.data.feedbacks;
    const chosenFeedbacks = allFeedbacks.filter((feedback) => reviewIds.includes(feedback.id));

    if (chosenFeedbacks.length === 0) {
      return res.json({ message: 'Нет отзывов для ответа' });
    }

    fs.writeFileSync('answers.txt', '');
    console.log(typeof contacts);

    for (const feedback of chosenFeedbacks) {
      let responseMessage = '';

      switch (feedback.productValuation) {
        case 1:
          responseMessage = responses.oneStar || '';
          break;
        case 2:
          responseMessage = responses.twoStars || '';
          break;
        case 3:
          responseMessage = responses.threeStars || '';
          break;
        case 4:
          responseMessage = responses.fourStars || '';
          break;
        case 5:
          responseMessage = responses.fiveStars || '';
          break;
        default:
          responseMessage = '';
      }

      if (!responseMessage) {
        const prompt = `Сгенерированный тобой текст сразу будет прикреплен к отзыву без изменений! Купленный товар: ${feedback.subjectName}.\n\n Юзернейм покупателя: ${feedback.userName || 'Покупатель не указан'}.\n\n Ниже приведен отзыв клиента о продукте:\n\n"${feedback.text}"\n\nСоздайте ответ на этот отзыв. Ответ должен быть вежливым и учитывать опасения клиента на основе отзыва и рейтинга продукта ${feedback.productValuation} из 5.${feedback.productValuation <= 2 ? `${marketName ? `Название магазина: ${marketName}` : ''} ${contacts ? `Укажи имеющиеся контакты магазина для связи в конце так как оно записано, ксли указан номер телефона и рядом соц сеть то это один контакт: ${contacts}` : ''}` : 'Если рейтинг больше двух, то не нужно говорит о дополнительных вопросах и упоменать обратную связь с магазином.' } Не говорить об обмене. Ответ не может быть длиннее 1000 символов, и должен быть на русском языке`;

        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        });

        responseMessage = aiResponse.choices[0].message.content.trim();
      }

      fs.appendFileSync('answers.txt', `Отзыв ID: ${feedback.id}\nОтвет: ${responseMessage}\n\n`);

      try {
        await axios.patch(
          `${WB_API_BASE_URL}/feedbacks`,
          {
            id: feedback.id,
            text: responseMessage,
          },
          { headers: { Authorization: apiKey } }
        );

        console.log(`Ответ успешно отправлен на отзыв ID: ${feedback.id}`);
      } catch (err) {
        console.error(`Ошибка при отправке ответа на отзыв ID: ${feedback.id}:`, err);
      }
    }

    res.json({ message: 'Ответы успешно отправлены на все отзывы и сохранены в файл' });
  } catch (err) {
    console.error('Ошибка при обработке отзывов:', err);
    res.status(500).json({ error: 'Ошибка при обработке отзывов' });
  }
};
