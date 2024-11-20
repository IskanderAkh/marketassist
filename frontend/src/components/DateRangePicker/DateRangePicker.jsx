import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
        className=" h-full pr-10 outline-none cursor-pointer btn-universal-btn select-none font-rfBold"
        onClick={onClick}
        ref={ref}
    >
        {value || "Выберите период"}
    </button>
));

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

    const maxEndDate = startDate ? new Date(new Date(startDate).setMonth(startDate.getMonth() + 6)) : null;

    return (
        <div className='indicator btn-universal w-full'>
            <div className='w-full relative flex items-center h-full '>
                <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Выберите период"
                    locale={ru}
                    className='w-full '
                    disabled={!authUser?.isVerified || !hasAccess}
                    maxDate={maxEndDate} // Limit the maximum end date to 6 months after the start date
                    customInput={<CustomInput />}
                />
                <img src="/calendar.svg" alt="" className='absolute right-10 font-rfBold' />
            </div>
            {!dateRange.every(date => date) && <span className="indicator-item badge badge-warning">Заполните!</span>}
        </div>
    );
};

export default DateRangePicker;
