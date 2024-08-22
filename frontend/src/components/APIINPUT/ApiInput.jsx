import React from 'react';

const ApiInput = ({ apiKey, setApiKey, handleFetchData }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
                className="border p-2 mr-2"
            />
            <button onClick={handleFetchData} className="bg-blue-500 text-white p-2">
                Fetch Data
            </button>
        </div>
    );
};

export default ApiInput;
