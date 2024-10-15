import React, { useEffect, useState } from "react";
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
import EditMarketDetailsModal from "../../components/EditMarketDetails/EditMarketDetailsModal";
import EditReviewResponsesModal from "../../components/EditReviewResponses/EditReviewResponsesModal";

const AppReviews = ({ authUser, authUserLoading, authUserError }) => {
  if (authUserLoading) {
    console.log('Loading');
    return <LoadingPage />;
  }
  const [apiKey, setApiKey] = useState(Cookies.get('apiKey') || authUser?.reviewsApiKey || '');
  const [editable, setEditable] = useState(false);
  const [marketName, setMarketName] = useState(authUser?.marketName || '');
  const [contacts, setContacts] = useState(authUser?.marketContacts || '');

  const [responses, setResponses] = useState({
    oneStar: '',
    twoStars: '',
    threeStars: '',
    fourStars: '',
    fiveStars: '',
  });

  const { data: reviews, isLoading, isError, refetch } = useQuery({
    queryKey: ['reviews', apiKey],
    queryFn: async () => {
      const res = await axios.get('/api/reviews/get-reviews', {
        headers: { Authorization: `${apiKey}` },
      });
      return res.data;
    },
    enabled: !!authUser?.isVerified && !!apiKey,
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


  useEffect(() => {
    if (authUser && authUser.responses) {
      setResponses({
        oneStar: authUser.responses.oneStar || '',
        twoStars: authUser.responses.twoStars || '',
        threeStars: authUser.responses.threeStars || '',
        fourStars: authUser.responses.fourStars || '',
        fiveStars: authUser.responses.fiveStars || '',
      });
    }
  }, [authUser]);




  const handleInputClick = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
    }
  };

  const handleApiKeyChange = (event) => {
    const value = event.target.value;
    setApiKey(value);
    Cookies.set('apiKey', value, { expires: 5 });
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
                <button className="btn btn-secondary" onClick={() => document.getElementById('edit-details-modal').click()}>
                  Изменить данные
                </button>

                <EditMarketDetailsModal authUser={authUser} refetchUserData={refetch} />

              </div>
            </div>
            <div className="flex items-center justify-end gap-3 flex-1 w-full mb-10">
              <div className="w-1/2">
                <h2>Название магазина:</h2>
                <strong>{authUser?.marketName}</strong>
              </div>
              <div className=" w-1/2">
                <h2>Контакты</h2>
                <strong>{authUser?.marketContacts}</strong>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 flex-row-reverse">
            <div className="flex flex-col gap-2 w-full">
              <p>Если поле "Текст отзыва" не <br /> заполнено, тогда его автоматически отвечает ИИ.</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {Object.entries(responses)?.map(([key, value], index) => (
                <div className="w-full flex items-center" key={index}>
                  <div className="h-full flex items-center justify-center">
                    {index + 1} <OneStar />
                  </div>
                  <input
                    type="text"
                    className="border p-2 mr-2 w-full"
                    value={value} // Use the value from the responses object
                    onClick={() => handleInputClick(value)} // Copy the value to clipboard
                    readOnly
                    disabled
                  />
                </div>
              ))}
              <button className="btn btn-primary" onClick={() => document.getElementById('edit-responses-modal').click()}>
                Редактировать мануальные ответы
              </button>
              <EditReviewResponsesModal responses={responses} setResponses={setResponses} refetchReviews={refetch} />

            </div>
          </div>
        </div>
        <ReviewsTable authUser={authUser} responses={responses} reviews={reviews} isError={isError} isLoading={isLoading} marketName={marketName} contacts={contacts} apiKey={apiKey} />
      </div>
    </Container>
  );
};

export default AppReviews;
