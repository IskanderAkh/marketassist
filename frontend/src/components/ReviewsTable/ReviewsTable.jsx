import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import RatingStars from "../RatingStars/RatingStars";

const ReviewsTable = ({responses}) => {
  const [apiKey, setApiKey] = useState('');
  const [reviews, setReviews] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [selectAll, setSelectAll] = useState(false);


  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  }

  const { mutate: fetchReviews, isLoading, isError } = useMutation({
    mutationFn: async () => {
      const res = await axios.get('/api/reviews/get-reviews', {
        headers: { Authorization: `${apiKey}` },
      });
      return res.data.data.feedbacks;
    },
    onSuccess: (data) => {
      console.log(data);

      setReviews(data);
    },
    onError: (error) => {
      console.error('Ошибка при получении отзывов:', error);
    },
  });

  const handleGetReviews = () => {
    fetchReviews();
  }

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allProductIds = reviews.map((review) => review.id);
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds([]);
    }
  }

  const handleRowSelect = (event, productId) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedProductIds((prev) => [...prev, productId]);
    } else {
      setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    }
  }
  return (
    <div>
      <div className="flex justify-between items-center mt-10 w-full mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Введите API ключ"
            className="border p-2 mr-2"
            onChange={handleApiKeyChange}
            value={apiKey}
          />
          <button
            className="bg-blue-500 text-white p-2"
            onClick={handleGetReviews}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 flex-1 w-full">
          <div className="w-1/2">
            <h2>Название магазина</h2>
            <input type="text" placeholder="Введите Название магазина" className="border p-2 mr-2 w-full" />
          </div>
          <div className=" w-1/2">
            <h2>Контакты</h2>
            <input type="text" placeholder="Введите контакты email или номер телефона" className="border p-2 mr-2 w-full" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isError && <p>Error fetching reviews.</p>}
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
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <tr key={i}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedProductIds.includes(review.id)}
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
              <p>No reviews available.</p>
            )}
          </tbody>
        </table>}
      </div>
    </div>
  );
};

export default ReviewsTable;
