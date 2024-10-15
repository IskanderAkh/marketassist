import React from 'react';
import { format } from 'date-fns';

const AutoSearchFiltersCard = ({ filters, warehouses }) => {
    const { warehouseId, dateRange, sliderValues } = filters || {};

    // Find the warehouse name from the list of warehouses based on warehouseId
    const warehouse = warehouses?.find(wh => String(wh.ID) === String(warehouseId));

    return (
        <div className="card bg-base-100 shadow-xl mt-5">
            <div className="card-body">
                <h2 className="card-title">Текущие фильтры для автопоиска</h2>
                <div className="divider"></div>

                {warehouseId && warehouse ? (
                    <p><strong>Склад:</strong> {warehouse.name}</p>
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
