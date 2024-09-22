import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import ReviewsTable from "../../components/ReviewsTable/ReviewsTable";
import OneStar from "../../components/RatingStars/OneStar";
import VerifyLink from "../../components/VerifyLink/VerifyLink";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const AppReviews = ({ authUser, authUserLoading, authUserError }) => {
  // Инициализация ключей
  const [apiKey, setApiKey] = useState(Cookies.get('apiKey') || '');
  const [currentApiKey, setCurrentApiKey] = useState(Cookies.get('apiKey') || '');
  const [editable, setEditable] = useState(false);
  const [marketName, setMarketName] = useState('');
  const [contacts, setContacts] = useState('');
  const [isApiKeyConfirmed, setIsApiKeyConfirmed] = useState(false);

  const { data: reviews, isLoading, isError, refetch } = useQuery({
    queryKey: ['reviews', currentApiKey],
    queryFn: async () => {
      const res = await axios.get('/api/reviews/get-reviews', {
        headers: { Authorization: `${currentApiKey}` },
      });
      Cookies.set('reviews', JSON.stringify(res.data.data.feedbacks), { expires: 5 });
      return res.data.data.feedbacks;
    },
    enabled: !!authUser?.isVerified && !!currentApiKey,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    onSuccess: (data) => {
      if (!data.length) {
        toast.error('Отзывы без ответов не найдены!');
      }
    },
    onError: () => {
      toast.error('Ошибка при получении отзывов!');
    },
  });


  const { data: hasAccess, isLoading: isLoadingAccess, error: errorAccess, isError: isErrorAccess } = useQuery({
    queryKey: ['checkPlanAccess'],
    queryFn: async () => {
      try {
        const response = await axios.post('/api/user/checkReviewPlanAccess');
        return response.data;
      } catch (error) {
        console.error("Error checking plan access:", error);
        throw error;
      }
    },
    enabled: !!authUser,
    retry: false
  });

  const [responses, setResponses] = useState({
    oneStar: "",
    twoStars: "",
    threeStars: "",
    fourStars: "",
    fiveStars: "",
  });

  const { mutate: setApiKeyMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.put('/api/apiKey/update-api-key', {
          apiKey: currentApiKey,
        })
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success('API ключ успешно изменен!');
    },
    onError: () => {
      toast.error('Ошибка при изменении API ключа!');
    },
  })
  const handleApiKeyChange = (event) => {
    const value = event.target.value;
    setApiKey(value);
    setIsApiKeyConfirmed(false);
    Cookies.set('apiKey', value, { expires: 5 });
  };

  const handleApiKeyConfirmation = () => {
    setCurrentApiKey(apiKey);
    setIsApiKeyConfirmed(true);
    setEditable(false);
    setApiKeyMutation()
  };


  const handleInputChange = (event, rating) => {
    setResponses({ ...responses, [rating]: event.target.value });
  };

  if (isLoadingAccess) {
    return <LoadingPage />;
  }

  return (
    <Container>
      {
        (!authUser?.isVerified && !authUserLoading && !authUserError) && <VerifyLink />
      }
      {
        isErrorAccess && <div role="alert" className="alert alert-error my-10">
          <span>{errorAccess.response.data.message}</span>
          <Link className='btn btn-info' to={'/profile'}>Купить план</Link>
        </div>
      }
      <div className="mt-10">
        <div className="flex">
          <div className="flex-1 mr-20">
            <div className="flex justify-between items-end mt-10 w-full mb-8">
              <div className="flex-1 flex items-end justify-start gap-2">
                <input
                  type="text"
                  placeholder="Введите API ключ"
                  className="input input-bordered input-info w-full max-w-48"
                  onChange={handleApiKeyChange}
                  value={apiKey}
                  disabled={isLoading || !authUser?.isVerified || !hasAccess || !editable}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditable(!editable)}
                  disabled={isLoading || !authUser?.isVerified || !hasAccess || apiKey.length < 1}
                >
                  {editable ? 'Отменить' : 'Изменить'}
                </button>
                <button
                  className="btn btn-primary btn-wide"
                  onClick={handleApiKeyConfirmation}
                  disabled={isLoading || !authUser?.isVerified || !hasAccess || isApiKeyConfirmed}
                >

                  {isLoading ? 'Загрузка...' : 'Подтвердить API ключ'}

                </button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 flex-1 w-full mb-10">
              <div className="w-1/2">
                <h2>Название магазина</h2>
                <input type="text" placeholder="Введите Название магазина" value={marketName} onChange={(e) => setMarketName(e.target.value)} className="border p-2 mr-2 w-full" disabled={isLoading || !authUser?.isVerified || !hasAccess}
                />
              </div>
              <div className=" w-1/2">
                <h2>Контакты</h2>
                <input type="text" placeholder="Введите контакты email или номер телефона" value={contacts} onChange={(e) => setContacts(e.target.value)} className="border p-2 mr-2 w-full" disabled={isLoading || !authUser?.isVerified || !hasAccess}
                />
              </div>
            </div>
            <div>
              <p>Создайте новый токен</p>
              <p>Не ставьте галочку "Только на чтение"</p>
              <p>Добавьте методы: "Контент, <br /> Статистика, Аналитика, Вопросы и отзывы "</p>
            </div>
          </div>
          <div className="flex justify-end gap-4 flex-row-reverse">
            <div className="flex flex-col gap-2 w-full">
              <p>Если поле "Текст отзыва" не <br /> заполнено, тогда его автоматически отвечает ИИ.</p>
            </div>
            <div className="flex flex-col gap-2   w-full">
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
        <ReviewsTable responses={responses} reviews={reviews} isError={isError} isLoading={isLoading} marketName={marketName} contacts={contacts} apiKey={currentApiKey}  />
      </div>
    </Container>
  );
};

export default AppReviews;
