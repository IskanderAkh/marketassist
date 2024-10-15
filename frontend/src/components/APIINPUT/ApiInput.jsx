import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const ApiInput = ({ authUser, hasAccess, page }) => {
    // Determine the initial API key based on the page
    const initialApiKeyValue = page === 'wh' ? authUser?.whApiKey || '' : authUser?.calcApiKey || '';
    const [apiKey, setApiKey] = useState(initialApiKeyValue);
    const [initialApiKey, setInitialApiKey] = useState(apiKey);
    const queryClient = useQueryClient();

    // Determine the API endpoint and method based on the page
    const apiEndpoint = page === 'wh' ? '/api/user/update-wh-api-key' : '/api/user/update-calc-api-key';
    const methodName = page === 'wh' ? 'Поставки' : 'Статистика';

    const { mutate: updateApiKey } = useMutation({
        mutationFn: async () => {
            const res = await axios.put(apiEndpoint, {
                apiKey,
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('API ключ обновлен успешно!');
            queryClient.invalidateQueries(['authUser', 'sold']);
            setInitialApiKey(apiKey);
            const modal = document.getElementById("api-key-modal");
            if (modal) modal.checked = false;
        },
        onError: () => {
            toast.error('Не удалось обновить API ключ');
        },
    });

    const resetApiKey = () => setApiKey(initialApiKey);

    return (
        <>
            <button className="btn btn-warning btn-wide text-black" onClick={() => document.getElementById('api-key-modal').click()}>
                Изменить API ключ
            </button>

            <input type="checkbox" id="api-key-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Редактировать API ключ</h3>
                    <div className='mt-5 p-2 border border-black'>
                        <h1>Создайте API ключ</h1>
                        <p>Добавьте метод: <strong>{methodName}</strong></p>
                    </div>
                    <textarea
                        type="text"
                        placeholder="Введите новый API ключ"
                        className="textarea textarea-bordered w-full my-4"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        disabled={!authUser?.isVerified || !hasAccess}
                    >
                    </textarea>

                    <div className="modal-action">
                        <label
                            htmlFor="api-key-modal"
                            className="btn"
                            onClick={resetApiKey}
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
