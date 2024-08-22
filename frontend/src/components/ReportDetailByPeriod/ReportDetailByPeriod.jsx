import React, { useState } from 'react';
import ApiInput from '../APIINPUT/ApiInput';
import ReportTable from '../ReportTable/ReportTable';
import useFetchData from '../../hooks/useFetchData';

const ReportDetailByPeriod = () => {
    const [apiKey, setApiKey] = useState('');
    const [fetchData, setFetchData] = useState(false);

    const { data, isLoading, groupedData, handleCostChange } = useFetchData(apiKey, fetchData);

    const handleFetchData = () => {
        setFetchData(true);
    };

    return (
        <div>
            <ApiInput apiKey={apiKey} setApiKey={setApiKey} handleFetchData={handleFetchData} />
            {isLoading && <div>Loading....</div>}
            {!isLoading && <ReportTable groupedData={groupedData} handleCostChange={handleCostChange} />}
        </div>
    );
};

export default ReportDetailByPeriod;
