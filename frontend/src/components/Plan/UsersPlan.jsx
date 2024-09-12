import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UsersPlan = ({ userPlan }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const currentPlan = userPlan?.[0];
    const queryClient = useQueryClient()
    const calculateTimeLeft = (endDate) => {
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference <= 0) {
            return "Expired";
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return `${days}д ${hours}ч ${minutes}м ${seconds}с`;
    };
    const { mutate: cancelSubscription, isPending } = useMutation({
        mutationFn: async () => {
            try {
                const res = await axios.post('/api/user/cancel-subscription')
                const response = await res.data
                return response
            } catch (error) {
                console.log(error);
                throw new Error;
            }
        },
        onSuccess: () => {
            toast.success("Подписка была успешно отменена!")
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            window.location.reload()

        },
        onError: () => {
            toast.error("Ошибка отмены подписки, попробуйте позже!")
        }
    })

    const cancelSub = () => {
        document.getElementById('my_modal_3').close()
        cancelSubscription()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentPlan?.endDate) {
                setTimeLeft(calculateTimeLeft(currentPlan.endDate));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentPlan]);

    return (
        <div className="card bg-primary text-primary-content w-2/6">
            <div className="card-body">
                <h2 className="card-title">Ваш тариф</h2>
                {currentPlan ? (
                    <div>
                        <div className='flex gap-4'>
                            <p className='text-start'>{currentPlan.name}</p>
                            <div className="card-actions justify-end border border-white text-center">
                                <h3 className='text-center w-full'>Осталось</h3>
                                <p className='text-center w-full'>{timeLeft}</p>
                            </div>
                        </div>
                        <button className="btn mt-10" onClick={() => document.getElementById('my_modal_3').showModal()}>Отменить Подписку</button>
                        <dialog id="my_modal_3" className="modal">
                            <div className="modal-box text-black">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" title='Закрыть'>✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Внимание!</h3>
                                <p className='py-4'>Вы уверены, что хотите отменить свою подписку? После отмены доступ к текущему тарифу будет утерян</p>
                                <button className='btn btn-error' title='Отменить подписку' onClick={cancelSub}>Отменить</button>
                            </div>
                        </dialog>
                    </div>
                ) : (
                    <p>Нет активного плана</p>
                )}
            </div>
        </div>
    );
};

export default UsersPlan;
