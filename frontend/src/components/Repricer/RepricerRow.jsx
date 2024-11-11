import React from 'react';

const RepricerRow = ({ product, editedProducts, handleInputChange, handleSaveClick, hasChanges }) => (
    <tr key={product.barcode}>
        <td>{product.barcode}</td>
        <td>{product.SCCode}</td>
        {/* Other cells */}
        <td>
            <input
                type="number"
                value={editedProducts[product.barcode]?.threshold ?? product.threshold}
                onChange={(e) => handleInputChange(product.barcode, 'threshold', e.target.value)}
                className="input input-bordered w-full"
            />
        </td>
        <td>
            <button
                className="btn btn-primary"
                onClick={() => handleSaveClick(product)}
                disabled={!hasChanges(product)}
            >
                Save
            </button>
        </td>
    </tr>
);

export default RepricerRow;
