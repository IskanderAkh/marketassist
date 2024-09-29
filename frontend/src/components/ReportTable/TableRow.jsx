import React from 'react';

const TableRow = ({ item, tax, excelData, logisticsCount }) => {

    const finalResult = item.totalPrice
        - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity 
        - (item.totalPrice * tax)
        - item.logisticsCost
        - item.compensation;


    return item.barcode ? (
        <tr className='text-black border-b border-gray-400 h-14 '>
            <td className='font-bold' ><span className='badge badge-outline'>{item.barcode}</span> </td>
            <td >₽ {item.totalPrice.toFixed(2)}</td>
            <td >
                <div className='flex gap-2 items-center h-full'>
                    <p>{excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost}</p>

                    X {item?.quantity } = ₽{(excelData[item.barcode] || item.productCost) * (item.quantity )}
                </div>
            </td>
            <td>₽ {(item.totalPrice * tax).toFixed(2)}</td>
            <td>{logisticsCount}   ₽ {item.logisticsCost.toFixed(2)}</td>
            <td>₽ {item.compensation.toFixed(2)}</td>
            <td>₽ {finalResult.toFixed(2)}</td>
        </tr>
    ) : null;
};

export default TableRow;
