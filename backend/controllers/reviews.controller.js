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
    const apiKey = req.user.reviewsApiKey;
    const { data } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
      headers: { Authorization: apiKey },
      params: {
        isAnswered: true,
        take: 5000,
        skip: 0,
      },
    });

    const feedbacks = data.data.feedbacks
      ? data.data.feedbacks.filter(feedback => feedback.text || (feedback.answer && feedback.answer.text))
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

cron.schedule('*/10 * * * *', async () => {
  try {
    const users = await User.find({ responseOnReviewsEnabled: true }).select('reviewsApiKey marketName marketContacts userErrors responses');

    for (const user of users) {
      if (!user.reviewsApiKey) {
        continue;
      }

      try {
        const { data: responseData } = await axios.get(`${WB_API_BASE_URL}/feedbacks`, {
          headers: { Authorization: user.reviewsApiKey },
          params: {
            isAnswered: false,
            take: 5000,
            skip: 0,
          },
        });

        const allFeedbacks = responseData.data.feedbacks.filter(feedback => !feedback.isAnswered);

        if (allFeedbacks.length === 0) {
          if (user.userErrors.length > 0) {
            user.userErrors = [];
            await user.save();
          }
          continue;
        }

        const responses = user.responses;

        for (const feedback of allFeedbacks) {
          await generateResponse(feedback, responses, user.marketName, user.marketContacts, user.reviewsApiKey);
        }

        if (user.userErrors.length > 0) {

          user.userErrors = [];
          await user.save();
        }
      } catch (userError) {
        console.error(`Ошибка при получении отзывов для пользователя! ${user._id}:`, userError.message);

        if (!user.userErrors.some(err => err.message === userError.message)) {
          user.userErrors.push({ message: `Ошибка при получении отзывов! ${userError.message}. Проверьте правильность ключа API` });
          await user.save();
        }
      }
    }
    console.log('Отзывы успешно обработаны');
  } catch (err) {
    console.error('Ошибка при обработке отзывов:', err);
  }
});

