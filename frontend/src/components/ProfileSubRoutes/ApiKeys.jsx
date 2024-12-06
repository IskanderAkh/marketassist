import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiKeys = () => {
    const [apiKeys, setApiKeys] = useState({
        reviewsApiKey: '',
        calcApiKey: '',
        whApiKey: '',
        repriceApiKey: ''
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Load current API keys from the server
    useEffect(() => {
        const fetchApiKeys = async () => {
            try {
                const { data } = await axios.get('/api/user/api-keys');
                setApiKeys(data);
                setLoading(false);
            } catch (error) {
                console.error("Ошибка при загрузке API ключей:", error);
                setLoading(false);
            }
        };
        fetchApiKeys();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setApiKeys((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const updateReviewsApiKey = async () => {
        await updateApiKey('reviewsApiKey', apiKeys.reviewsApiKey, '/api/user/update-reviews-api-key');
    };

    const updateCalcApiKey = async () => {
        await updateApiKey('calcApiKey', apiKeys.calcApiKey, '/api/user/update-calc-api-key');
    };

    const updateWHApiKey = async () => {
        await updateApiKey('whApiKey', apiKeys.whApiKey, '/api/user/update-wh-api-key');
    };

    const updateRepriceApiKey = async () => {
        await updateApiKey('repriceApiKey', apiKeys.repriceApiKey, '/api/user/update-reprice-api-key');
    };

    const updateApiKey = async (keyName, keyValue, url) => {
        try {
            await axios.put(url, { apiKey: keyValue });
            setMessage(`Ключ ${keyName} успешно обновлён`);
        } catch (error) {
            console.error(`Ошибка при обновлении ключа ${keyName}:`, error);
            setMessage(`Не удалось обновить ключ ${keyName}`);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="container mx-auto my-8 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Обновление API ключей</h2>
            {message && (
                <div className={`alert ${message.includes('успешно') ? 'alert-success' : 'alert-error'} shadow-lg mb-4`}>
                    <span>{message}</span>
                </div>
            )}
            <form className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Ключ для Отзывов</span>
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            name="reviewsApiKey"
                            value={apiKeys.reviewsApiKey}
                            onChange={handleChange}
                            className="input input-bordered flex-grow"
                            placeholder="Введите ключ для отзывов"
                        />
                        <button
                            type="button"
                            onClick={updateReviewsApiKey}
                            className="btn btn-primary ml-2"
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Ключ для Калькулятора</span>
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            name="calcApiKey"
                            value={apiKeys.calcApiKey}
                            onChange={handleChange}
                            className="input input-bordered flex-grow"
                            placeholder="Введите ключ для калькулятора"
                        />
                        <button
                            type="button"
                            onClick={updateCalcApiKey}
                            className="btn btn-primary ml-2"
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Ключ для Приемки</span>
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            name="whApiKey"
                            value={apiKeys.whApiKey}
                            onChange={handleChange}
                            className="input input-bordered flex-grow"
                            placeholder="Введите ключ для приемки"
                        />
                        <button
                            type="button"
                            onClick={updateWHApiKey}
                            className="btn btn-primary ml-2"
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Ключ для Репрайсера</span>
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            name="repriceApiKey"
                            value={apiKeys.repriceApiKey}
                            onChange={handleChange}
                            className="input input-bordered flex-grow"
                            placeholder="Введите ключ для Репрайсера"
                        />
                        <button
                            type="button"
                            onClick={updateRepriceApiKey}
                            className="btn btn-primary ml-2"
                        >
                            Обновить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ApiKeys;
