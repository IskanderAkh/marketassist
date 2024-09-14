import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';
import toast from "react-hot-toast";

const Plan = ({ plan, i, authUser, userPlan }) => {
    const [barcodeCount, setBarcodeCount] = useState(100);
    const id = plan._id;
    const isPlanWithNoLimit = id === "66dfdc354c02e37851cb52e7";

    const queryClient = useQueryClient();
    const currentUserSubscriptionLvl = userPlan?.[0]?.subscribtionLvl ?? 0;
    const isHigherSubscription = currentUserSubscriptionLvl >= plan.lvl;

    const { mutate: buyPlan, isPending, isError } = useMutation({
        mutationFn: async (id) => {
            try {
                const res = await axios.post("/api/user/purchase-plan", {
                    planId: id,
                    subscriptionDurationInDays: isPlanWithNoLimit ? 0 : 30,
                    barcodes: plan.lvl === 2 ? barcodeCount : undefined
                });
                const response = res.data;
                return response;
            } catch (error) {
                console.log(error);
                throw new Error("Ошибка при покупке плана");
            }
        },
        onSuccess: () => {
            toast.success('Вы успешно обновили подписку');
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            window.location.reload();
        },
        onError: () => {
            toast.error('Ошибка при обновлении подписки');
        }
    });

    const handleBarcodeChange = (e) => {
        const selectedCount = parseInt(e.target.value);
        setBarcodeCount(selectedCount);
    };

    const calculatePrice = () => {
        if (plan.lvl === 2) {
            const extraBarcodes = barcodeCount - 100;
            return 4000 + (extraBarcodes / 100) * 1000;
        }
        return plan.currentCost;
    };

    return (
        <div>
            <div className="card bg-base-100 w-96 shadow-xl h-full">
                <div className="card-body">
                    <h2 className="card-title">{plan.name}</h2>
                    <div className='my-4'>
                        <div>
                            <p>{calculatePrice()}₽/мес.</p>
                            <p className='line-through'>{plan.prevCost}₽/мес. <span>{-plan.planDiscount}%</span></p>
                        </div>
                        {plan._id === "66dfdcd64c02e37851cb52e9" && <div>
                            {/* Specific content for this plan */}
                        </div>}
                        {plan.lvl === 2 && (
                            <div className="my-4">
                                <label htmlFor="barcodeCount">Выберите количество баркодов:</label>
                                <select id="barcodeCount" value={barcodeCount} onChange={handleBarcodeChange} className="select select-bordered w-full">
                                    {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((count) => (
                                        <option key={count} value={count}>{count}</option>
                                    ))}
                                </select>
                                <p>Цена: {calculatePrice()}₽</p>
                            </div>
                        )}
                    </div>
                    <p className=''>{plan.overview}</p>
                    <div className="card-actions justify-end mt-10">
                        <button
                            className="btn"
                            onClick={buyPlan.bind(this, id)}
                            disabled={isHigherSubscription || isPending}
                        >
                            {isHigherSubscription ? 'Недоступно' : 'Купить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plan;
