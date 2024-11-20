import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import RatingStars from "../RatingStars/RatingStars";
import toast from "react-hot-toast";


const ReviewsTable = ({ isError, isLoading, reviews, authUser }) => {

  const queryClient = useQueryClient();
  const [responseOnReviewsEnabled, setResponseOnReviewsEnabled] = useState(authUser?.responseOnReviewsEnabled || false);

  const toggleAutoResponses = async () => {
    try {
      const response = await axios.post('/api/reviews/toggle-auto-responses', {
        userId: authUser._id,
        enable: !responseOnReviewsEnabled,
      });
      setResponseOnReviewsEnabled(!responseOnReviewsEnabled);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error toggling auto responses");
    }
  };


  return (
    <div>
      <div className="flex w-full items-center justify-between mt-32 mb-10">
        <div className="text-center text-xl font-bold">
          Отзывы клиентов
        </div>
        <div className="btn-universal">
          <button
            className={`${responseOnReviewsEnabled ? '' : ''} btn-universal-btn`}
            onClick={toggleAutoResponses}
          >
            {responseOnReviewsEnabled ? 'Отключить автоответы' : 'Включить автоответы'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading && <p>Загрузка...</p>}
        {!isLoading && <table className="table border-none">
          <thead>
            <tr>
              <th> </th>
              <th>Имя</th>
              <th >Отзыв</th>
              <th>Рейтинг</th>
              <th>Товар</th>
              <th>Ответ на отзыв</th>
            </tr>
          </thead>
          <tbody>
            {(reviews?.length > 0) && !isError ? (
              reviews.map((review, i) => (
                <tr key={i} className="border-none">
                  <th>
                    {i + 1}
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{review.userName || 'Покупатель'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-52" >
                    {review.text ? review.text : review.pros}
                  </td>
                  <td className="w-40">
                    <RatingStars rating={review.productValuation} />
                  </td>
                  <td>
                    {review.subjectName}
                  </td>
                  <td>
                    {review?.answer?.text ? review.answer.text : 'Отвечено без текста'}
                  </td>
                </tr>
              ))
            ) : (
              <p>Нет подходящих отзывов.</p>
            )}
          </tbody>
        </table>}
      </div>
    </div>
  );
};

export default ReviewsTable;
