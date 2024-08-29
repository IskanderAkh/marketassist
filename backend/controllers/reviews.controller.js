import fs from 'fs';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { log } from 'console';
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
        isAnswered: true,
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
  const { apiKey } = req.body

  try {
    // Fetch all feedbacks that need a response
    const { data: responseData } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
      headers: { Authorization: apiKey },
      params: {
        isAnswered: true, // Неотвеченные отзывы
        take: 100, // Получить до 100 отзывов за раз
        skip: 0,
      },
    });

    const allFeedbacks = responseData.data.feedbacks;

    if (allFeedbacks.length === 0) {
      return res.json({ message: 'Нет отзывов для ответа' });
    }

    // Initialize the file and clear existing content
    //   fs.writeFileSync('answers.txt', '');

    // Iterate over each feedback sequentially
    for (const feedback of allFeedbacks) {
      const prompt = `Ниже приведен отзыв клиента о продукте:\n\n"${feedback.text}"\n\nСоздайте ответ на этот отзыв. Ответ должен быть вежливым и учитывать опасения клиента на основе отзыва и рейтинга продукта ${feedback.productValuation}. Он не может быть длиннее 1000 символов`;

      // Генерация ответа с использованием OpenAI
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });

      const responseMessage = aiResponse.choices[0].message.content.trim();
      console.log(responseMessage);

      // // Save the response to the file
      fs.appendFileSync('answers.txt', `Отзыв ID: ${feedback.id}\nОтвет: ${responseMessage}\n\n`);

      // Send the response to Wildberries (uncomment to activate)
      // try {
      //   await axios.patch(
      //     `${WB_API_BASE_URL}/feedbacks`,
      //     {
      //       id: feedback.id,
      //       text: responseMessage,
      //     },
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