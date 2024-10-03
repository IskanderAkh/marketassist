import { useState } from 'react';
import axios from 'axios';

const useFetchData = (apiKey, startDate, endDate) => {
    const [groupedData, setGroupedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recalculationOfPaidAcceptance, setRecalculationOfPaidAcceptance] = useState(0);
    const [storage, setStorage] = useState(0);
    const [retention, setRetention] = useState(0);
    const getData = async () => {
        if (!apiKey || !startDate || !endDate) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post('/api/report/report-detail', {
                apiKey,
                dateFrom: startDate,
                dateTo: endDate,
            });
            console.log(response);

            const { combinedData, recalculationOfPaidAcceptance, storage, retention } = response.data;  // Destructure API response
            setGroupedData(combinedData);
            setStorage(storage);
            setRetention(retention);
            setRecalculationOfPaidAcceptance(recalculationOfPaidAcceptance);
        } catch (error) {
            console.error('Error fetching report details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        groupedData,
        getData,
        storage,
        retention,
        recalculationOfPaidAcceptance
    };
};

export default useFetchData;
