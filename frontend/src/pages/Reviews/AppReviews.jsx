import Container from "@/components/ui/Container";
import React, { useState } from "react";
import ReviewsTable from "../../components/ReviewsTable/ReviewsTable";
import OneStar from "../../components/RatingStars/OneStar";

const AppReviews = () => {
  const [responses, setResponses] = useState({
    oneStar: "",
    twoStars: "",
    threeStars: "",
    fourStars: "",
    fiveStars: "",
  });

  const handleInputChange = (event, rating) => {
    setResponses({ ...responses, [rating]: event.target.value });
  };

  return (
    <Container>
      <div>
        <div className="flex">

          <div className="flex-1">
            <div role="alert" className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>
                <p>Создайте новый токен</p>
                <p>Не ставьте галочку "Только на чтение"</p>
                <p>Добавьте методы: "Контент, <br /> Статистика, Аналитика, Вопросы и отзывы "</p>
              </span>
            </div>
          
          </div>
          <div className="flex justify-end flex-1">
            <div className="flex flex-col gap-2 max-w-96  w-full">
              <div className="w-full flex items-center">
                <div className="h-full flex items-center justify-center">
                  1<OneStar />
                </div>
                <input
                  type="text"
                  className="border p-2 mr-2 w-full"
                  placeholder="Текст отзыва"
                  value={responses.oneStar}
                  onChange={(e) => handleInputChange(e, "oneStar")}
                />
              </div>
              <div className="w-full flex items-center">
                <div className="h-full flex items-center justify-center">
                  2<OneStar />
                </div>
                <input
                  type="text"
                  className="border p-2 mr-2 w-full"
                  placeholder="Текст отзыва"
                  value={responses.twoStars}
                  onChange={(e) => handleInputChange(e, "twoStars")}
                />
              </div>
              <div className="w-full flex items-center">
                <div className="h-full flex items-center justify-center">
                  3<OneStar />
                </div>
                <input
                  type="text"
                  className="border p-2 mr-2 w-full"
                  placeholder="Текст отзыва"
                  value={responses.threeStars}
                  onChange={(e) => handleInputChange(e, "threeStars")}
                />
              </div>
              <div className="w-full flex items-center">
                <div className="h-full flex items-center justify-center">
                  4<OneStar />
                </div>
                <input
                  type="text"
                  className="border p-2 mr-2 w-full"
                  placeholder="Текст отзыва"
                  value={responses.fourStars}
                  onChange={(e) => handleInputChange(e, "fourStars")}
                />
              </div>
              <div className="w-full flex items-center">
                <div className="h-full flex items-center justify-center">
                  5<OneStar />
                </div>
                <input
                  type="text"
                  className="border p-2 mr-2 w-full"
                  placeholder="Текст отзыва"
                  value={responses.fiveStars}
                  onChange={(e) => handleInputChange(e, "fiveStars")}
                />
              </div>
            </div>
          </div>
        </div>
        <ReviewsTable responses={responses} />
      </div>
    </Container>
  );
};

export default AppReviews;
