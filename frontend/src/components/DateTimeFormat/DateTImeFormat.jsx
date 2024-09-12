import React from 'react';

const UserCreatedAt = ({ authUser }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };

        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    };

    return (
        <div className='flex items-start text-start'>
            <div className='flex gap-3'>
                <img src="./document.svg" className='w-4' alt="" /> <p>  Дата принятия оферты: <br /> {formatDate(authUser?.createdAt)}</p>
            </div>
        </div>
    );
};

export default UserCreatedAt;
