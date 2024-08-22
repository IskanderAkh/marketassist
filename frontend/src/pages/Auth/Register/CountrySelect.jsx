import React from 'react';

import { countries } from './countries';
const CountrySelect = ({ onCountryChange }) => {
  const handleChange = (event) => {  
    onCountryChange(event.target.value);
  };

  return (
    <div className=''>
      <select
        id="country"
        name="country"
        onChange={handleChange}
        className="form-container-input bg-transparent"
      >
        <option value="">Select a country</option>
        {countries.map((country, index) => (
          <option key={index} value={country.name}>{country.name}</option>
        ))}
      </select>

    </div>
  );
};

export default CountrySelect;
