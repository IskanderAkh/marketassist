import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale'; // Import Russian locale

const DateRangePicker = ({ dateRange, setDateRange }) => {
    const [startDate, endDate] = dateRange;

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setDateRange(dates);
    };

    return (
        <div className='flex items-center border pr-2'>
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                dateFormat="yyyy/MM/dd"
                className="py-2 pl-2 outline-none cursor-pointer"
                placeholderText="Выберите период"
                locale={ru}  // Set the locale to Russian
            />
            <img src="/calendar.svg" alt="" />
        </div>
    );
};

export default DateRangePicker;
