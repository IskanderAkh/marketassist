import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale'; 

const DateRangePicker = ({ dateRange, setDateRange, authUser, hasAccess }) => {
    const [startDate, endDate] = dateRange;

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setDateRange(dates);
    };

    return (
        <div className='flex items-center border pr-2 max-w-60 w-full'>
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                dateFormat="yyyy/MM/dd"
                className="py-2 pl-2 outline-none cursor-pointer "
                placeholderText="Выберите период"
                locale={ru}
                disabled={!authUser?.isVerified || !hasAccess }
            />
            <img src="/calendar.svg" alt="" />
        </div>
    );
};

export default DateRangePicker;
