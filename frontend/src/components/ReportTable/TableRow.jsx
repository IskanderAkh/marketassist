import React from 'react';

const TableRow = ({ item, tax, excelData, logisticsCount, columnType, kkk }) => {

    const finalResult = item.totalPrice
        - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity
        - (item.totalPrice * tax)
        - item.logisticsCost
        - item.compensation
        + item.compensationForDamages
        + item.acquiringAdjustments
        + item.salesAdjustment

    const getFirstRowValue = () => {
        switch (columnType) {
            case 'Баркод':
                return item.barcode;
            case 'Артикул поставщика':
                return item.saName;
            default:
                return item.barcode;
        }
    };
    const getKkkRowValue = () => {
        switch (kkk) {
            case 'Компенсация ущерба':
                return item.compensationForDamages;
            case 'Коррекция продаж':
                return item.salesAdjustment;
            case 'Корректировка эквайринга':
                return item.acquiringAdjustments;
            default:
                return item.compensationForDamages;
        }
    };
    return item.barcode ? (
        <tr className='text-black border-b border-gray-400 h-14 '>
            <td className='font-bold'>
                <span className='badge badge-outline'>{getFirstRowValue()}</span>
            </td>
            <td >₽ {item.totalPrice.toFixed(2)}</td>
            <td >
                <div className='flex gap-2 items-center h-full'>
                    <p>{excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost}</p>

                    X {item?.quantity} = ₽{(excelData[item.barcode] || item.productCost) * (item.quantity)}
                </div>
            </td>
            {/* <td></td> */}
            <td>₽ {(item.totalPrice * tax).toFixed(2)}</td>
            <td>{logisticsCount}   ₽ {item.logisticsCost.toFixed(2)}</td>
            <td>₽ {item.compensation.toFixed(2)}</td>
            <td>₽ {getKkkRowValue()}</td>
            <td>₽ {finalResult.toFixed(2)}</td>
        </tr>
    ) : null;
};

export default TableRow;
