import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AcceptanceFilter from './AcceptanceFilter/AcceptanceFilter';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import ApiInput from '../APIINPUT/ApiInput';
import AutoSearchFiltersCard from './AutoSearchFiltersCard/AutoSearchFiltersCard';

const WarehousesWrapper = ({ authUser, authUserLoading, authUserError }) => {
    const [apiKey, setApiKey] = useState(authUser?.whApiKey || '');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [acceptanceRates, setAcceptanceRates] = useState([]);
    const [filteredAcceptanceRates, setFilteredAcceptanceRates] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [sliderValues, setSliderValues] = useState([0, 100]);
    const [filtersSaved, setFiltersSaved] = useState(false);
    const [filtersEnabled, setFiltersEnabled] = useState(authUser?.whsearchEnabled || false);

    // Fetching warehouses
    const { data: warehouses, isError, isLoading: warehousesLoading } = useQuery({
        queryKey: ['warehouses', apiKey],
        queryFn: async () => {
            const res = await axios.post('/api/warehouse/getListOfWarehouses', { apiKey });
            return res.data;
        },
        enabled: !!apiKey,
        onSuccess: (data) => {
            setWarehouses(data);
            toast.success('Склады получены');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Не удалось получить склады');
        }
    });
    const toggleFilters = async () => {
        try {
            // Отправляем запрос на включение/выключение фильтров
            const newState = !filtersEnabled;  // Инвертируем текущее состояние
            await axios.post('/api/warehouse/toggleFilters', {
                userId: authUser._id,
                whsearchEnabled: newState,
            });

            setFiltersEnabled(newState);  // Обновляем состояние на фронтенде
            toast.success(newState ? 'Фильтры включены' : 'Фильтры выключены');
        } catch (error) {
            console.error('Error toggling filters:', error);
            toast.error('Не удалось изменить состояние фильтров');
        }
    };

    // Fetching acceptance rates


    const queryClient = useQueryClient();


    // Function to apply filters
    // Modify the applyFilters function
    const applyFilters = async () => {
        const [min, max] = sliderValues;

        if (!selectedWarehouse) {
            toast.error('Пожалуйста, выберите склад');
            return;
        }
        // Check if the date range is properly set before proceeding
        if (!dateRange[0] || !dateRange[1]) {
            toast.error('Пожалуйста, выберите диапазон дат');
            return;
        }

        // Check if a warehouse is selected before proceeding

        const filters = {
            sliderValues: [min, max],
            dateRange,
            warehouseId: selectedWarehouse,  // Ensuring the selected warehouse ID is included
        };

        try {
            await axios.post('/api/warehouse/applyFilters', {
                userId: authUser._id,
                filters, // Passing the filters object
            });
            setFiltersSaved(true);
            queryClient.invalidateQueries(['authUser']);
            toast.success('Фильтры сохранены');
        } catch (error) {
            console.error(error);
            toast.error('Не удалось сохранить фильтры');
        }
    };






    // Function to enable autoSearch

    return (
        <div className='mt-10'>
            <h1>Бронь лимитов</h1>
            <div className="flex justify-between items-end mt-10 w-full mb-8">
                <ApiInput authUser={authUser} page={'wh'} hasAccess={true} />
            </div>
            <div className='mt-10'>
                <div>
                    <h2>Склад</h2>
                    <select
                        className="select w-full max-w-xs select-bordered"
                        disabled={!warehouses?.length || warehousesLoading}
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                        <option disabled value="">Выберите склад</option>
                        {warehouses?.map((house) => (
                            <option key={house.ID} value={house.ID}>{house.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='mt-5'>
                <h3>Фильтр коэффициентов</h3>
                <AcceptanceFilter
                    min={0}
                    max={100}
                    onSliderChange={setSliderValues}
                />

                <h3 className='mt-5'>Фильтр по дате</h3>
                <div className='flex justify-between'>
                    <DateRangePicker
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        authUser={{ isVerified: true }}
                        hasAccess={true}
                    />
                    <button className='btn btn-accent mt-4' onClick={applyFilters}>
                        Применить фильтры
                    </button>
                </div>
            </div>
            <AutoSearchFiltersCard
                filters={authUser?.filters}
                selectedWarehouse={selectedWarehouse}
                dateRange={dateRange}
                sliderValues={sliderValues}
                warehouses={warehouses}
            />
            <div className='mt-5 flex w-full justify-end items-end'>
                <button className="btn btn-primary" onClick={toggleFilters}>
                    {filtersEnabled ? 'Выключить Автопоиск' : 'Включить Автопоиск'}
                </button>
            </div>
            {/* 
            <div className='mt-10'>
                <h3>Коэффициенты приема</h3>
                {filteredAcceptanceRates && filteredAcceptanceRates.length > 0 ? (
                    <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
                        {filteredAcceptanceRates.map((rate, index) => (
                            <li key={index} className='card bg-base-100 shadow-xl'>
                                <div className="card-body">
                                    <h2 className="card-title">{rate.warehouseName}</h2>
                                    <h3>Тип: <strong>{rate.boxTypeName}</strong></h3>
                                    <p>Дата: {formatDate(rate.date)}</p>
                                    <p>Коэффициент: {rate.coefficient}</p>
                                    <div className="card-actions justify-end">
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-center text-red-500'>Приемка не доступна</p>
                )}
            </div> */}
        </div>
    );
};

export default WarehousesWrapper;
