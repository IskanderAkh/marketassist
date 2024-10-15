import React, { useState } from 'react';
import Slider from 'react-slider';
import './styles.scss';

const AcceptanceFilter = ({ min, max, onSliderChange }) => {
    const [sliderValues, setSliderValues] = useState([min, max]);

    const handleSliderChange = (newValues) => {
        setSliderValues(newValues);
        onSliderChange(newValues); // Notify parent of the new values
    };

    return (
        <div className="acceptance-filter bg-white p-6 rounded-lg mt-6 shadow-md">
            <Slider
                className="horizontal-slider"
                min={min}
                max={max}
                value={sliderValues}
                onChange={handleSliderChange}
                renderThumb={(props) => <div {...props}></div>}
                pearling
                minDistance={5}
            />
            <div className="flex justify-between items-center mt-4">
                <div>Коэффициенты: x{sliderValues[0]} - x{sliderValues[1]}</div>
            </div>
        </div>
    );
};

export default AcceptanceFilter;
