import React from 'react';

const ReportTable = ({ groupedData, handleCostChange }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-xs">
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Total Price</th>
                        <th>Product Cost</th>
                        <th>Tax (7%)</th>
                        <th>Logistics Cost</th>
                        <th>Конечный итог</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        groupedData?.map((item, i) => (
                            item.barcode && <tr key={i}>
                                <td>{item.barcode}</td>
                                <td>₽ {item.totalPrice.toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.productCost}
                                        onChange={(e) => handleCostChange(item.barcode, e.target.value)}
                                        className="border border-gray-200 p-2 max-w-20 mx-2"
                                        placeholder="Enter Cost"
                                    />
                                    X {item?.quantity} = {item.productCost * item.quantity}
                                </td>
                                <td>₽ {(item.totalPrice * 0.07).toFixed(2)}</td>
                                <td>₽ {item.logisticsCost.toFixed(2)}</td>
                                {item.productCost && <td>₽ {item.checkingAccount.toFixed(2)}</td>}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;
