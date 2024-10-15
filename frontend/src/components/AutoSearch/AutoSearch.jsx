import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AutoSearch = ({ apiKey, selectedWarehouse, dateRange, sliderValues }) => {
    const [isAutoSearchEnabled, setIsAutoSearchEnabled] = useState(false);

    const { mutate: toggleAutoSearch } = useMutation({
        mutationFn: async (isEnabled) => {
            await axios.post('/api/warehouse/toggleAutoSearch', {
                apiKey,
                warehouseId: selectedWarehouse,
                startDate: dateRange[0] ? dateRange[0].toISOString() : null,
                endDate: dateRange[1] ? dateRange[1].toISOString() : null,
                minRate: sliderValues[0],
                maxRate: sliderValues[1],
                isEnabled
            });
        },
        onSuccess: () => {
            setIsAutoSearchEnabled(!isAutoSearchEnabled);
            toast.success(isAutoSearchEnabled ? 'Автопоиск выключен' : 'Автопоиск включен');
        },
        onError: () => {
            toast.error('Не удалось изменить статус автопоиска');
        }
    });

    const handleToggle = () => {
        toggleAutoSearch(!isAutoSearchEnabled);
    };

    return (
        <div className="mt-5">
            <button className="btn btn-primary" onClick={handleToggle}>
                {isAutoSearchEnabled ? 'Отключить автопоиск' : 'Включить автопоиск'}
            </button>
        </div>
    );
};

export default AutoSearch;
