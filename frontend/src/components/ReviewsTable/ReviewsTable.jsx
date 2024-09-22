import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import RatingStars from "../RatingStars/RatingStars";
import toast from "react-hot-toast";


const ReviewsTable = ({ apiKey, responses, isError, isLoading, reviews, marketName, contacts }) => {


  const [selectedReviewsIds, setselectedReviewsIds] = useState([])
  const [selectAll, setSelectAll] = useState(false);
  const queryClient = useQueryClient();

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allProductIds = reviews.map((review) => review.id);
      setselectedReviewsIds(allProductIds);
    } else {
      setselectedReviewsIds([]);
    }
  }

  const handleRowSelect = (event, productId) => {
    const checked = event.target.checked;
    if (checked) {
      setselectedReviewsIds((prev) => [...prev, productId]);
    } else {
      setselectedReviewsIds((prev) => prev.filter((id) => id !== productId));
    }
  }
  const { mutate: setAnswers, isPending, isError: error } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.patch('/api/reviews/respond-to-all-reviews', {
          apiKey,
          reviewIds: selectedReviewsIds,
          responses,
          marketName,
          contacts,
        })
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success('Ответы на отзывы отправлены')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    }
  })
  const answerOnReviews = () => {
    if (!marketName || !contacts) {
      toast.error("Ввведите название магазина и контакты!")
      return;
    }
    setAnswers()
  }
  return (
    <div>
      <div className="flex w-full items-center justify-between my-10">
        <div className="text-center text-xl font-bold">
          Выберите отзывы для ответа
        </div>
        <button className="btn btn-primary self-end pointer-events-auto" title="Ответить на выбранные отзывы" onClick={answerOnReviews} disabled={selectedReviewsIds.length === 0 || !apiKey}>Ответить на отзывы</button>
      </div>
      <div className="overflow-x-auto">
        {isLoading && <p>Загрузка...</p>}
        {!isLoading && <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </label>
              </th>
              <th>Имя</th>
              <th>Отзыв</th>
              <th>Рейтинг</th>
              <th>Товар</th>
              <th>Ответ на отзыв</th>
            </tr>
          </thead>
          <tbody>
            {(reviews?.length > 0) && !isError ? (
              reviews.map((review, i) => (
                <tr key={i}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedReviewsIds.includes(review.id)}
                        onChange={(e) => handleRowSelect(e, review.id)}
                      />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">

                      <div>
                        <div className="font-bold">{review.userName || 'Покупатель'}</div>

                      </div>
                    </div>
                  </td>
                  <td className="max-w-52">
                    {review.text}
                  </td>
                  <td>
                    <RatingStars rating={review.productValuation} />
                  </td>
                  <td>
                    {review.subjectName}
                  </td>
                  <td>
                    {review?.answer?.text ? review.answer.text : 'Нет ответа'}
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
