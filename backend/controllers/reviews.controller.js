import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cron from 'node-cron';
import User from '../models/user.model.js';
dotenv.config();

const WB_API_BASE_URL = 'https://feedbacks-api.wildberries.ru/api/v1';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.proxyapi.ru/openai/v1",
});

export const getReviews = async (req, res) => {
  try {
    const apiKey = req.user.reviewsApiKey;
    const response = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
      headers: { Authorization: apiKey },
      params: {
        isAnswered: true,
        take: 200,
        skip: 0,
      },
    });

    if (!response || !response.data || !response.data.data) {
      console.error('Invalid response structure:', response);
      return res.status(500).json({ error: 'Invalid response from Wildberries API' });
    }

    const feedbacks = response.data.data.feedbacks
      ? response.data.data.feedbacks.filter(feedback => feedback.text || (feedback.answer && feedback.answer.text) || feedback.pros)
      : [];
    res.json(feedbacks);

  } catch (err) {
    console.error('Ошибка при получении отзывов:', err);
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
};

export const toggleAutoResponses = async (req, res) => {
  const { userId, enable } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.responseOnReviewsEnabled = enable;
    await user.save();

    res.json({ message: `Auto responses ${enable ? 'enabled' : 'disabled'} successfully` });
  } catch (error) {
    console.error('Error toggling auto responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const generateResponse = async (feedback, responses, marketName = null, contacts = null, apiKey) => {
  let responseMessage = '';

  try {
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
      const prompt = `Сгенерированный тобой текст сразу будет прикреплен к отзыву без изменений! Купленный товар: ${feedback.subjectName}.\n\nЮзернейм покупателя: ${feedback.userName || 'Покупатель не указан'}.\n\nНиже приведен отзыв клиента о продукте:\n\n"${feedback.text
        ? feedback.text
        : `${feedback.pros ? 'Плюсы: ' + feedback.pros : ''} ${feedback.cons ? 'Минусы: ' + feedback.cons : ''}`
        }"\n\nСоздайте ответ на этот отзыв. Ответ должен учитывать рейтинг продукта ${feedback.productValuation} из 5.${feedback.productValuation <= 5
          ? (marketName || contacts
            ? ` ${marketName ? `Название магазина: ${marketName}.` : ''}${contacts ? ` Укажи контакты для связи: ${contacts}.` : ''}`
            : ' Пожалуйста, не упоминайте название магазина и контакты, так как они не указаны.'
          )
          : ''
        }`;


      try {
        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        });

        responseMessage = aiResponse.choices[0].message.content.trim();
      } catch (aiError) {
        console.error('Ошибка при генерации ответа с помощью OpenAI:', aiError);
        throw aiError;
      }

      try {
        await axios.patch(
          `${WB_API_BASE_URL}/feedbacks`,
          { id: feedback.id, text: responseMessage },
          { headers: { Authorization: apiKey } }
        );
        console.log(`Ответ успешно отправлен на отзыв ID: ${feedback.id}`);
      } catch (apiError) {
        console.error(`Ошибка при отправке ответа на отзыв ID: ${feedback.id}:`, apiError);
      }
    }

    return responseMessage;
  } catch (error) {
    console.error('Ошибка в generateResponse:', error);
    throw error;
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

    for (const feedback of chosenFeedbacks) {
      const responseMessage = await generateResponse(feedback, responses, marketName, contacts);

      try {
        await axios.patch(
          `${WB_API_BASE_URL}/feedbacks`,
          { id: feedback.id, text: responseMessage },
          { headers: { Authorization: apiKey } }
        );
        console.log(`Ответ успешно отправлен на отзыв ID: ${feedback.id}`);
      } catch (err) {
        console.error(`Ошибка при отправке ответа на отзыв ID: ${feedback.id}:`, err);
      }
    }
    allFeedbacks = [];
    res.json({ message: 'Ответы успешно отправлены на все отзывы и сохранены в файл' });
  } catch (err) {
    console.error('Ошибка при обработке отзывов:', err);
    res.status(500).json({ error: 'Ошибка при обработке отзывов' });
  }
};

export const updateResponses = async (req, res) => {
  const { responses } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" })
    }

    user.responses = {
      oneStar: (responses.oneStar === undefined) ? user.responses.oneStar : responses.oneStar,
      twoStars: (responses.twoStars === undefined) ? user.responses.twoStars : responses.twoStars,
      threeStars: (responses.threeStars === undefined) ? user.responses.threeStars : responses.threeStars,
      fourStars: (responses.fourStars === undefined) ? user.responses.fourStars : responses.fourStars,
      fiveStars: (responses.fiveStars === undefined) ? user.responses.fiveStars : responses.fiveStars
    };

    await user.save();
    res.json({ message: 'Ответы успешно обновлены' });
  } catch (error) {
    console.error('Error updating responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

cron.schedule('*/20 * * * *', async () => {
  try {
    const users = await User.find({ responseOnReviewsEnabled: true }).select('reviewsApiKey marketName marketContacts userErrors responses');

    for (const user of users) {
      if (!user.reviewsApiKey) {
        continue;
      }

      try {
        const { data: responseData } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
          headers: {
            Authorization: user.reviewsApiKey,
            'Content-Type': 'application/json',
          },
          params: {
            isAnswered: false,
            take: 200,
            skip: 0,
          },
        });

        const feedbacks = responseData.data.feedbacks;
        console.log(`Обработка отзывов для пользователя _id: ${user._id}`);

        for (const feedback of feedbacks) {
          try {
            await generateResponse(feedback, user.responses, user.marketName, user.marketContacts, user.reviewsApiKey);
            console.log(`Ответ сгенерирован для отзыва _id: ${feedback.id}, пользователя: ${user._id}`);
          } catch (responseError) {
            console.error(`Ошибка при генерации ответа для отзыва _id: ${feedback.id}:`, responseError);
          }
        }

      } catch (userError) {
        console.error(`Ошибка при получении отзывов для пользователя _id: ${user._id}:`, userError.response?.data || userError);
      }
    }

    console.log('Отзывы успешно обработаны');
  } catch (err) {
    console.error('Ошибка при обработке отзывов:', err);
  }
});


