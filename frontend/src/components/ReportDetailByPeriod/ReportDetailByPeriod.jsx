import React, { useState } from 'react';
import ApiInput from '../APIINPUT/ApiInput';
import ReportTable from '../ReportTable/ReportTable';
import useFetchData from '../../hooks/useFetchData';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { Link } from 'react-router-dom';
import VerifyLink from '../VerifyLink/VerifyLink';
import LoadingPage from '../LoadingPage/LoadingPage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReportDetailByPeriod = ({ authUser, authUserLoading, authUserError, calcApiKey }) => {
    const requiredPlans = ['66dfdcd64c02e37851cb52e9'];

    const { data: hasAccess, isLoading: isLoadingAccess, error: errorAccess, isError: isErrorAccess } = useQuery({
        queryKey: ['checkPlanAccess', requiredPlans],
        queryFn: async () => {
            try {
                const response = await axios.post('/api/user/checkCalcPlanAccess');
                return response.data;
            } catch (error) {
                console.error("Error checking plan access:", error);
                throw error;
            }
        },
        enabled: !!authUser,
        retry: false
    });

    const [apiKey, setApiKey] = useState(calcApiKey);
    const [dateRange, setDateRange] = useState([null, null]);
    const [fetchData, setFetchData] = useState(false);
    const [startDate, endDate] = dateRange;
    const { isLoading, groupedData, handleCostChange } = useFetchData(apiKey, fetchData, startDate, endDate);

    const handleFetchData = () => {
        if(dateRange.some(date => !date))
        {
            toast.error('Выберите дату')
            return;
        }
        setFetchData(true);
    };

    if (isLoadingAccess) {
        return <LoadingPage />
    }

    return (
        <div className='mt-10'>
            {
                (!authUser?.isVerified && !authUserLoading && !authUserError) && <VerifyLink />
            }
            {
                isErrorAccess && <div role="alert" className="alert alert-error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorAccess.response.data.message}</span>
                    <Link className='btn btn-info' to={'/profile'}>Купить план</Link>
                </div>

            }
            <div className='flex mb-10 gap-4 flex-col mt-10 items-start'>
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} authUser={authUser} hasAccess={hasAccess} />
                <ApiInput apiKey={apiKey} setApiKey={setApiKey}  authUser={authUser} hasAccess={hasAccess} />
                <div className='flex items-center'>
                    <button className='btn btn-primary btn-outline btn-wide' onClick={handleFetchData} disabled={!hasAccess}>Получить отчет</button>
                </div>
            </div>
            {isLoading && <div>Загрузка....</div>}
            {!isLoading && <ReportTable groupedData={groupedData} handleCostChange={handleCostChange} />
            }
        </div>
    );
};

export default ReportDetailByPeriod;
