import React, { useState } from 'react';
import './styles.scss';

const AcceptanceFilter = ({ min, max, onSliderChange }) => {
    const [sliderValues, setSliderValues] = useState([min, max]);

    const handleInputChange = (index, value) => {
        const newValues = [...sliderValues];
        newValues[index] = value;
        setSliderValues(newValues);
        onSliderChange(newValues);
    };

    return (
        <div className="flex justify-between items-center mt-4 btn-universal max-w-md">
            <div className="btn-universal-btn flex items-center px-7 py-4">
                <label className="flex items-center">
                    <span className='font-rfBold'>Коэффициенты:</span>
                    <div className='flex items-center justify-center border border-black rounded-btn ml-2'>
                        <span className="ml-2 text-gray-500 font-rfRegular ">x</span>
                        <input
                            type="number"
                            min={min}
                            max={max}
                            value={sliderValues[0]}
                            onChange={(e) => handleInputChange(0, Number(e.target.value))}
                            className="outline-none bg-transparent text-gray-500 font-rfRegular"
                        />
                    </div>
                    <div className='flex items-center justify-center border border-black rounded-btn ml-2'>
                        <span className='ml-2 text-gray-500 font-rfRegular'>x</span>
                        <input
                            type="number"
                            min={min}
                            max={max}
                            value={sliderValues[1]}
                            onChange={(e) => handleInputChange(1, Number(e.target.value))}
                            className="outline-none bg-transparent text-gray-500 font-rfRegular"
                        />

                    </div>
                </label>
            </div>
        </div>
    );
};

export default AcceptanceFilter;
