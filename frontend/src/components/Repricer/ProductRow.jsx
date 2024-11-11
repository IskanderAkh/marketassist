// components/ProductRow.js
import React from 'react';

const ProductRow = ({ product, onEdit, onSave, onDelete }) => {
    const { barcode, SCCode, brand, subject, Price, Discount, totalQuantity, threshold, changeRatio } = product;
    const handleInputChange = (barcode, field, value) => {
        console.log("Updating:", barcode, field, value); // Debug line
        setEditedProducts(prev => ({
            ...prev,
            [barcode]: {
                ...prev[barcode],
                [field]: value,
            },
        }));
    };

    return (
        <tr>
            <td>{barcode}</td>
            <td>{SCCode}</td>
            <td>{brand}</td>
            <td>{subject}</td>
            <td>{Price}</td>
            <td>{Discount}%</td>
            <td>
                <input
                    type="number"
                    value={editedProducts[product.barcode]?.threshold ?? product.threshold}
                    onChange={(e) => handleInputChange(product.barcode, 'threshold', e.target.value)}
                    className="input input-bordered w-full input-with-unit"
                />

            </td>
            <td>
                <input
                    type="number"
                    value={changeRatio}
                    onChange={(e) => onEdit(barcode, 'changeRatio', e.target.value)}
                />
            </td>
            <td>{totalQuantity}</td>
            <td>
                <button onClick={() => onSave(product)} disabled={!threshold && !changeRatio}>Сохранить</button>
                <button onClick={() => onDelete(barcode)}>Удалить</button>
            </td>
        </tr>
    );
};

export default ProductRow;
