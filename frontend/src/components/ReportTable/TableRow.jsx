import React from 'react';

const TableRow = ({ item, tax, excelData, handleCostChange }) => {
    const finalResult = item.totalPrice
        - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity
        - (item.totalPrice * tax)
        - item.logisticsCost;

    return item.barcode ? (
        <tr className='text-black border-b border-gray-400 h-14'>
            <td>{item.barcode}</td>
            <td>₽ {item.totalPrice.toFixed(2)}</td>
            <td className='flex gap-2 items-center'>
                <p>{excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost}</p>
                {/* <input
                    type="number"
                    value={excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost}
                    onChange={(e) => handleCostChange(item.barcode, e.target.value)}
                    className="border border-gray-200 p-2 max-w-20 mx-2"
                    placeholder="Enter Cost"
                /> */}
                X {item?.quantity} = ₽{(excelData[item.barcode] || item.productCost) * item.quantity}
            </td>
            <td>₽ {(item.totalPrice * tax).toFixed(2)}</td>
            <td>₽ {item.logisticsCost.toFixed(2)}</td>
            <td>₽ {finalResult.toFixed(2)}</td>
        </tr>
    ) : null;
};

export default TableRow;
