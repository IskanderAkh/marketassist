import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import RatingStars from "../RatingStars/RatingStars";
import toast from "react-hot-toast";


const ReviewsTable = ({ apiKey, responses, isError, isLoading, reviews, marketName, contacts }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
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


      {/* Ответ на выбранные отзывы */}

      <div className="flex w-full items-end justify-end">
        <button className="btn btn-primary self-end" title="Ответить на выбранные отзывы" onClick={answerOnReviews} disabled={selectedReviewsIds.length === 0 || !apiKey}>Ответить на отзывы</button>
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
              <th></th>
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
