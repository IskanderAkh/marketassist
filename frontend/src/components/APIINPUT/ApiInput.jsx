import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const ApiInput = ({ authUser, hasAccess }) => {
    const [apiKey, setApiKey] = useState(authUser?.calcApiKey || ''); // Initialize from authUser
    const [initialApiKey, setInitialApiKey] = useState(apiKey); // To track the original API key

    // React Query mutation to update the API key
    const { mutate: updateApiKey } = useMutation({
        mutationFn: async () => {
            const res = await axios.put('/api/user/update-calc-api-key', {
                apiKey,
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('API ключ обновлен успешно!');
            setInitialApiKey(apiKey);
            const modal = document.getElementById("api-key-modal");
            if (modal) modal.checked = false;
        },
        onError: () => {
            toast.error('Не удалось обновить API ключ');
        },
    });

    // Reset API key to initial value
    const resetApiKey = () => setApiKey(initialApiKey);

    return (
        <>

            
            <button className="btn btn-secondary btn-wide" onClick={() => document.getElementById('api-key-modal').click()}>
                Изменить API ключ
            </button>

            {/* The Modal for editing API key */}
            <input type="checkbox" id="api-key-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Редактировать API ключ</h3>
                    <div className='mt-5 p-2 border border-black '>
                        <h1>Создайте API ключ</h1>
                        <p>Добавьте метод: <strong>Статистика</strong> </p>
                    </div>
                    <input
                        type="text"
                        placeholder="Введите новый API ключ"
                        className="input input-bordered w-full my-4"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        disabled={!authUser?.isVerified || !hasAccess}
                    />

                    <div className="modal-action">
                        <label
                            htmlFor="api-key-modal"
                            className="btn"
                            onClick={resetApiKey} // Reset to initial key
                        >
                            Отменить
                        </label>
                        <button className="btn btn-primary" onClick={() => updateApiKey()} disabled={!authUser?.isVerified || !hasAccess}>
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApiInput;
