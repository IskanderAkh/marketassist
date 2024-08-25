import React, { useState } from 'react';
import ApiInput from '../APIINPUT/ApiInput';
import ReportTable from '../ReportTable/ReportTable';
import useFetchData from '../../hooks/useFetchData';
import DateRangePicker from '../DateRangePicker/DateRangePicker';

const ReportDetailByPeriod = () => {
    const [apiKey, setApiKey] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [fetchData, setFetchData] = useState(false);

    const [startDate, endDate] = dateRange;
    const { data, isLoading, groupedData, handleCostChange } = useFetchData(apiKey, fetchData, startDate, endDate);

    const handleFetchData = () => {
        setFetchData(true);
    };

    return (
        <div>
            <div className='flex mb-10 gap-4 flex-col '>
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                <ApiInput apiKey={apiKey} setApiKey={setApiKey} handleFetchData={handleFetchData} />
            </div>
            {isLoading && <div>Загрузка....</div>}
            {!isLoading && <ReportTable groupedData={groupedData} handleCostChange={handleCostChange} fetchData={fetchData} />
        }
        </div>
    );
};

export default ReportDetailByPeriod;
