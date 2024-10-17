import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AcceptanceFilter from './AcceptanceFilter/AcceptanceFilter';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import ApiInput from '../APIINPUT/ApiInput';
import AutoSearchFiltersCard from './AutoSearchFiltersCard/AutoSearchFiltersCard';

const WarehousesWrapper = ({ authUser }) => {
    const [apiKey, setApiKey] = useState(authUser?.whApiKey || '');
    const [selectedWarehouses, setSelectedWarehouses] = useState(new Set());
    const [dateRange, setDateRange] = useState([null, null]);
    const [sliderValues, setSliderValues] = useState([0, 100]);
    const [filtersEnabled, setFiltersEnabled] = useState(authUser?.whsearchEnabled || false);

   
    const { data: warehouses, isLoading: warehousesLoading } = useQuery({
        queryKey: ['warehouses', apiKey],
        queryFn: async () => {
            const res = await axios.post('/api/warehouse/getListOfWarehouses', { apiKey });
            return res.data;
        },
        enabled: !!apiKey,
        onError: (error) => {
            console.error(error);
            toast.error('Не удалось получить склады');
        }
    });

    const queryClient = useQueryClient();

    const toggleFilters = async () => {
        try {
            const newState = !filtersEnabled;
            await axios.post('/api/warehouse/toggleFilters', {
                userId: authUser._id,
                whsearchEnabled: newState,
            });

            setFiltersEnabled(newState);
            toast.success(newState ? 'Фильтры включены' : 'Фильтры выключены');
        } catch (error) {
            console.error('Error toggling filters:', error);
            toast.error('Не удалось изменить состояние фильтров');
        }
    };

    const applyFilters = async () => {
        const [min, max] = sliderValues;

        if (!selectedWarehouses.size) { 
            toast.error('Пожалуйста, выберите склад');
            return;
        }
        if (!dateRange[0] || !dateRange[1]) {
            toast.error('Пожалуйста, выберите диапазон дат');
            return;
        }

        const filters = {
            sliderValues: [min, max],
            dateRange,
            warehouseIds: Array.from(selectedWarehouses),
        };

        try {
            await axios.post('/api/warehouse/applyFilters', {
                userId: authUser._id,
                filters,
            });
            queryClient.invalidateQueries(['authUser']);
            toast.success('Фильтры сохранены');
        } catch (error) {
            console.error(error);
            toast.error('Не удалось сохранить фильтры');
        }
    };

    const handleWarehouseChange = (e) => {
        const { value, checked } = e.target;
        const updatedWarehouses = new Set(selectedWarehouses);
        if (checked) {
            updatedWarehouses.add(value); 
        } else {
            updatedWarehouses.delete(value); 
        }

        setSelectedWarehouses(updatedWarehouses);

    };

    return (
        <div className='mt-10'>
            <h1>Бронь лимитов</h1>
            <div className="flex justify-between items-end mt-10 w-full mb-8">
                <ApiInput authUser={authUser} page={'wh'} hasAccess={true} />
            </div>
            <div className='flex flex-row-reverse items-start justify-between w-full'>

                <div className=''>
                    {/* Button to open modal */}
                    <button className="btn" onClick={() => document.getElementById('my_modal_3').showModal()}>
                        Выбрать склады
                    </button>
                </div>
                <div className=''>
                    <h3 className=''>Фильтр по дате</h3>
                    <div className='flex justify-between'>
                        <DateRangePicker
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            authUser={{ isVerified: true }}
                            hasAccess={true}
                        />
                    </div>
                </div>
                <div>
                    <h3>Фильтр коэффициентов</h3>
                    <AcceptanceFilter
                        min={0}
                        max={100}
                        onSliderChange={setSliderValues}
                    />
                </div>
            </div>
            <button className='btn btn-accent mt-4' onClick={applyFilters}>
                Применить фильтры
            </button>

            <AutoSearchFiltersCard
                filters={authUser?.filters}
                selectedWarehouses={Array.from(selectedWarehouses)} // Convert Set to array
                dateRange={dateRange}
                sliderValues={sliderValues}
                warehouses={warehouses}
            />

            <div className='mt-5 flex w-full justify-end items-end'>
                <button className="btn btn-primary" onClick={toggleFilters}>
                    {filtersEnabled ? 'Выключить Автопоиск' : 'Включить Автопоиск'}
                </button>
            </div>

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Выберите склады</h3>
                    <div className="mt-4">
                        {warehouses?.map((house) => (
                            <label key={house.ID} className="block">
                                <input
                                    type="checkbox"
                                    value={house.ID}
                                    onChange={handleWarehouseChange}
                                    className="checkbox checkbox-primary"
                                />
                                <span className="ml-2">{house.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-primary" type="button" onClick={() => document.getElementById('my_modal_3').close()}>
                            Применить
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default WarehousesWrapper;
