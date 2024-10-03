import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

const DateRangePicker = ({ dateRange, setDateRange, authUser, hasAccess }) => {
    const [startDate, endDate] = dateRange;

    const handleDateChange = (dates) => {
        const [start, end] = dates;

        if (start) {
            start.setHours(0, 0, 0, 0);
        }
        if (end) {
            end.setHours(23, 59, 59, 999);
        }

        const startUTC = start ? new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) : null;
        let endUTC = end ? new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())) : null;

        if (startUTC && endUTC) {
            const oneMonthLater = new Date(startUTC);
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

            if (endUTC > oneMonthLater) {
                endUTC = new Date(oneMonthLater.setHours(23, 59, 59, 999)); 
            }
        }

        setDateRange([startUTC, endUTC]);
    };

    return (
        <div className='indicator'>
            <div className='flex items-center border pr-2 max-w-60 w-full'>
                <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    className="py-2 pl-2 outline-none cursor-pointer"
                    placeholderText="Выберите период"
                    locale={ru}
                    disabled={!authUser?.isVerified || !hasAccess}
                />
                <img src="/calendar.svg" alt="" />
            </div>
            {!dateRange.every(date => date) && <span className="indicator-item badge badge-warning">Заполните!</span>}
        </div>
    );
};

export default DateRangePicker;
