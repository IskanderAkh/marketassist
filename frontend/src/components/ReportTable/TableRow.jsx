import React from 'react';

const TableRow = ({ item, tax, excelData, logisticsCount, columnType, kkk, showPenalty }) => {

    const finalResult = item.transferGoodsToSeller
        - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity
        - (item.totalPrice * tax)
        - item.logisticsCost
        - item.compensation
        - item.penalty
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
    const getPenaltyOrCompensation = () => {
        switch (showPenalty) {
            case 'Возмещение/Возврат':
                return item.compensation
            case 'Штрафы':
                return item.penalty
        }
    }
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
        <tr className='text-black  h-14 '>
            <td className='font-bold'>
                <span className=''>{getFirstRowValue()}</span>
            </td>
            <td >  ₽ {item.transferGoodsToSeller.toFixed(2)}</td>
            <td >
                <div className='flex flex-col gap-2 items-center h-full'>
                    <p>{excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost}  X {item?.quantity}</p>

                    <p>{(excelData[item.barcode] || item.productCost) * (item.quantity)} р</p>
                </div>
            </td>
            {/* <td></td> */}
            <td>₽ {(item.totalPrice * tax).toFixed(2)}</td>
            <td>{logisticsCount}   ₽ {item.logisticsCost.toFixed(2)}</td>
            <td>₽ {getPenaltyOrCompensation().toFixed(2)}</td>
            <td>₽ {getKkkRowValue().toFixed(2)}</td>
            <td>₽ {finalResult.toFixed(2)}</td>
        </tr>
    ) : null;
};

export default TableRow;
