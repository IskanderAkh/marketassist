import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditMarketDetailsModal = ({ authUser, refetchUserData }) => {
    const [initialMarketName, setInitialMarketName] = useState(authUser?.marketName || '');
    const [initialContacts, setInitialContacts] = useState(authUser?.marketContacts || '');
    const [initialReviewsApiKey, setInitialReviewsApiKey] = useState(authUser?.reviewsApiKey || '');

    const [marketName, setMarketName] = useState(initialMarketName);
    const [contacts, setContacts] = useState(initialContacts);
    const [reviewsApiKey, setReviewsApiKey] = useState(initialReviewsApiKey);

    const resetFields = () => {
        setMarketName(initialMarketName);
        setContacts(initialContacts);
        setReviewsApiKey(initialReviewsApiKey);
    };

    const { mutate: updateDetails } = useMutation({
        mutationFn: async () => {
            const res = await axios.put('/api/user/update-market-details', {
                userId: authUser._id,
                marketName,
                marketContacts: contacts,
                reviewsApiKey,
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Информация о магазине и ключ обновлены успешно!');
            refetchUserData();
            setInitialMarketName(marketName);
            setInitialContacts(contacts);
            setInitialReviewsApiKey(reviewsApiKey);
            const modal = document.getElementById("edit-details-modal");
            if (modal) {
                modal.checked = false;
            }
        },
        onError: () => {
            toast.error('Не удалось обновить подробности');
        },
    });

    const handleSave = () => {
        updateDetails();
    };

    useEffect(() => {
        resetFields();
    }, [authUser]);

    return (
        <>
            <input type="checkbox" id="edit-details-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-black text-center text-lg mb-4">Редактировать детали магазина и API</h3>

                    <strong className='font-rfBold'>Название Магазина</strong>
                    <input
                        type="text"
                        placeholder="Название магазина"
                        className="input input-bordered w-full my-4"
                        value={marketName}
                        onChange={(e) => setMarketName(e.target.value)}
                    />
                    <strong className='font-rfBold'>Контакты</strong>
                    <input
                        type="text"
                        placeholder="Контакты"
                        className="input input-bordered w-full my-4"
                        value={contacts}
                        onChange={(e) => setContacts(e.target.value)}
                    />
                    <strong className='font-rfBold'>API токен</strong>
                    <textarea
                        type="text"
                        placeholder="API-ключ для отзывов"
                        className="textarea textarea-bordered w-full my-4"
                        value={reviewsApiKey}
                        onChange={(e) => setReviewsApiKey(e.target.value)}
                    />
                    <div className='border border-black p-2'>
                        <p>Создайте новый токен</p>
                        <p>Не ставьте галочку "Только на чтение"</p>
                        <p>Добавьте методы: "Контент, <br /> Статистика, Аналитика, Вопросы и отзывы "</p>
                    </div>
                    <div className="modal-action">
                        <label
                            htmlFor="edit-details-modal"
                            className="btn"
                            onClick={resetFields}
                        >
                            Отменить
                        </label>
                        <button className="btn btn-primary" onClick={handleSave}>
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditMarketDetailsModal;
