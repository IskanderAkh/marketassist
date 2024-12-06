import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const AutoSearchFiltersCard = ({ filters, warehouses, selectedWarehousesId }) => {
    const { warehouseIds = [], dateRange, sliderValues } = filters || {};

    const [loading, setLoading] = useState(true);
    const [selectedWarehouses, setSelectedWarehouses] = useState([]);

    useEffect(() => {
        setLoading(true);
        const filteredWarehouses = warehouses?.filter(wh => warehouseIds.includes(String(wh.ID))) || [];
        setSelectedWarehouses(filteredWarehouses);
        setLoading(false); 
    }, [warehouses, warehouseIds]);

    return (
        <div className="card bg-base-100 shadow-xl mt-20">
            <div className="card-body">
                <h2 className="card-title">Текущие фильтры для автопоиска</h2>
                <div className="divider"></div>

                {loading ? (
                    <p>Идет загрузка складов...</p>
                ) : selectedWarehouses.length > 0 ? (
                    <p>
                        <strong>Склад(ы):</strong> {selectedWarehouses.map(wh => wh.name).join(', ')}
                    </p>
                ) : (
                    <p className="text-red-500">Склад не выбран</p>
                )}

                {dateRange && dateRange[0] && dateRange[1] ? (
                    <p>
                        <strong>Диапазон дат:</strong> {format(new Date(dateRange[0]), 'dd/MM/yyyy')} - {format(new Date(dateRange[1]), 'dd/MM/yyyy')}
                    </p>
                ) : (
                    <p className="text-red-500">Диапазон дат не установлен</p>
                )}

                {sliderValues ? (
                    <p><strong>Коэффициент:</strong> {sliderValues[0]} - {sliderValues[1]}</p>
                ) : (
                    <p className="text-red-500">Коэффициент не выбран</p>
                )}
            </div>
        </div>
    );
};

export default AutoSearchFiltersCard;
