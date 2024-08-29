import React from 'react';

const TaxToggle = ({ tax, setTax }) => {
    const handleTaxChange = () => {
        setTax(prevTax => (prevTax === 0.15 ? 0.07 : 0.15));
    };

    return (
        <div className="form-control w-52 flex flex-row">
            <span className="label-text font-bold w-full">Выберите налог</span>
            <label className="label cursor-pointer">
                <div className='flex items-center gap-2'>
                    7%
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        defaultChecked={tax === 0.15}
                        onClick={handleTaxChange}
                    />
                    15%
                </div>
            </label>
        </div>
    );
};

export default TaxToggle;
