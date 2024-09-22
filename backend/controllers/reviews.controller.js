import fs from 'fs';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cron from 'node-cron';
import User from '../models/user.model.js';
dotenv.config();

const WB_API_BASE_URL = 'https://feedbacks-api.wildberries.ru/api/v1';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getReviews = async (req, res) => {
  try {
    const apiKey = req.headers.authorization;

    const { data } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
      headers: { Authorization: apiKey },
      params: {
        isAnswered: true,
        take: 5000,
        skip: 0,
      },
    });

    res.json(data);
  } catch (err) {
    console.error('Ошибка при получении отзывов:', err);
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
};



const generateResponse = async (feedback, responses, marketName = null, contacts = null) => {
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
    const prompt = `Сгенерированный тобой текст сразу будет прикреплен к отзыву без изменений! Купленный товар: ${feedback.subjectName}.\n\nЮзернейм покупателя: ${feedback.userName || 'Покупатель не указан'}.\n\nНиже приведен отзыв клиента о продукте:\n\n"${feedback.text}"\n\nСоздайте ответ на этот отзыв. Ответ должен учитывать рейтинг продукта ${feedback.productValuation} из 5. ${feedback.productValuation <= 2 ? `${marketName ? ` Название магазина: ${marketName}.` : ''} ${contacts ? ` Укажи контакты для связи: ${contacts}.` : ''}` : ''}`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    responseMessage = aiResponse.choices[0].message.content.trim();

    // Закомментировано: отправка ответа на Wildberries API
    // try {
    //   await axios.patch(
    //     `${WB_API_BASE_URL}/feedbacks`,
    //     { id: feedback.id, text: responseMessage },
    //     { headers: { Authorization: apiKey } }
    //   );
    //   console.log(`Ответ успешно отправлен на отзыв ID: ${feedback.id}`);
    // } catch (err) {
    //   console.error(`Ошибка при отправке ответа на отзыв ID: ${feedback.id}:`, err);
    // }
  }

  return responseMessage;
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

    for (const feedback of chosenFeedbacks) {
      const responseMessage = await generateResponse(feedback, responses, marketName, contacts);

      // Закомментировано: отправка ответа на Wildberries API
      // try {
      //   await axios.patch(
      //     `${WB_API_BASE_URL}/feedbacks`,
      //     { id: feedback.id, text: responseMessage },
      //     { headers: { Authorization: apiKey } }
      //   );
      //   console.log(`Ответ успешно отправлен на отзыв ID: ${feedback.id}`);
      // } catch (err) {
      //   console.error(`Ошибка при отправке ответа на отзыв ID: ${feedback.id}:`, err);
      // }
    }

    res.json({ message: 'Ответы успешно отправлены на все отзывы и сохранены в файл' });
  } catch (err) {
    console.error('Ошибка при обработке отзывов:', err);
    res.status(500).json({ error: 'Ошибка при обработке отзывов' });
  }
};

cron.schedule('*/10 * * * *', async () => {
  try {
    const users = await User.find().select('reviewsApiKey');

    for (const user of users) {
      if (!user.reviewsApiKey) {
        continue;
      }
      const { data: responseData } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
        headers: { Authorization: user.reviewsApiKey },
        params: {
          isAnswered: true,
          take: 5000,
          skip: 0,
        },
      });

      const allFeedbacks = responseData.data.feedbacks.filter(feedback => !feedback.isAnswered);

      if (allFeedbacks.length === 0) {
        return;
      }

      const responses = {};

      for (const feedback of allFeedbacks) {
        await generateResponse(feedback, responses, user?.marketName, user?.marketContacts);
      }
    }
    console.log('Все отзывы успешно обработаны');
  } catch (err) {
    console.error('Ошибка при обработке отзывов:', err);
  }
});