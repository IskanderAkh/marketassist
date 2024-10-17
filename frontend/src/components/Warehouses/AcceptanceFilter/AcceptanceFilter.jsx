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
        <div className="collection-filter bg-white p-6 rounded-lg mt-6 shadow-md">
            <div className="flex justify-between items-center mt-4">
                <div>
                    <label htmlFor="minValue">Минимум: </label>
                    <input
                        id="minValue"
                        type="number"
                        min={min}
                        max={max}
                        value={sliderValues[0]}
                        onChange={(e) => handleInputChange(0, Number(e.target.value))}
                        className="input input-bordered input-xs"
                    />
                </div>
                <div>
                    <label htmlFor="maxValue">Максимум: </label>
                    <input
                        id="maxValue"
                        type="number"
                        min={min}
                        max={max}
                        value={sliderValues[1]}
                        onChange={(e) => handleInputChange(1, Number(e.target.value))}
                        className="input input-bordered input-xs"
                    />
                </div>
            </div>
            <div className="mt-4">
                Коэффициенты: x{sliderValues[0]} - x{sliderValues[1]}
            </div>
        </div>
    );
};

export default AcceptanceFilter;
