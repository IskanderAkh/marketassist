import React, { useEffect, useState } from 'react';
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

const ReportDetailByPeriod = () => {
    const { data: authUser, isLoading: authUserLoading, isError: authUserError } = useQuery({ queryKey: ['authUser'] });

    const [apiKey, setApiKey] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Button disable state

    useEffect(() => {
        if (authUser && authUser.calcApiKey) {
            setApiKey(authUser.calcApiKey);
        }
    }, [authUser]);

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

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const { isLoading, groupedData, handleCostChange, logisticsCount, getData, recalculationOfPaidAcceptance, storage, retention } = useFetchData(apiKey, startDate, endDate);

    const handleFetchData = () => {
        if (dateRange.some(date => !date)) {
            toast.error('Выберите дату');
            return;
        }

        getData();

        setIsButtonDisabled(true);
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 60000);
    };

    if (isLoadingAccess) {
        return <LoadingPage />;
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
                <div className='flex gap-4 w-full justify-between'>
                    <Link to={'/product-cost'}><button className='btn btn-wide'>Себестоимость</button> </Link>
                    <ApiInput apiKey={apiKey} setApiKey={setApiKey} authUser={authUser} hasAccess={hasAccess} />
                </div>
                <div className='flex gap-4 w-full justify-between'>
                    <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} authUser={authUser} hasAccess={hasAccess} />
                    <button className='btn btn-secondary btn-wide' onClick={handleFetchData} disabled={!hasAccess || isButtonDisabled}>
                        {isButtonDisabled ? 'Подождите...' : 'Получить отчет'}
                    </button>
                </div>
            </div>
            {isLoading && <LoadingPage />}
            {!isLoading && <ReportTable groupedData={groupedData} handleCostChange={handleCostChange} logisticsCount={logisticsCount} recalculationOfPaidAcceptance={recalculationOfPaidAcceptance}
                storage={storage}
                retention={retention}
            />}
        </div>
    );
};

export default ReportDetailByPeriod;
