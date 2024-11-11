import React from 'react';
import RepricerRow from './RepricerRow';

const RepricerTable = ({ productsData, editedProducts, handleInputChange, handleSaveClick, hasChanges }) => (
    <table className="table-auto w-full mt-4">
        <thead>
            {/* Table headers */}
        </thead>
        <tbody>
            {productsData.map(product => (
                <RepricerRow
                    key={product.barcode}
                    product={product}
                    editedProducts={editedProducts}
                    handleInputChange={handleInputChange}
                    handleSaveClick={handleSaveClick}
                    hasChanges={hasChanges}
                />
            ))}
        </tbody>
    </table>
);

export default RepricerTable;
