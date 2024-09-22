import React from 'react';

const ApiInput = ({ apiKey, setApiKey, handleFetchData, authUser, hasAccess }) => {

    return (
        <div className="">
            <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Введите API ключ"
                className="border p-2 mr-2"
                disabled={!authUser?.isVerified || !hasAccess}
            />
            <button onClick={handleFetchData} className="btn btn-outline btn-info" disabled={!authUser?.isVerified || !hasAccess}
            >
                Подтвердить API ключ
            </button>
        </div>
    );
};

export default ApiInput;
