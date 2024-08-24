import React from 'react';

const ApiInput = ({ apiKey, setApiKey, handleFetchData }) => {
    return (
        <div className="">
            <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Введите API ключ"
                className="border p-2 mr-2"
            />
            <button onClick={handleFetchData} className="bg-blue-500 text-white p-2">
                Загрузить данные
            </button>
        </div>
    );
};

export default ApiInput;
