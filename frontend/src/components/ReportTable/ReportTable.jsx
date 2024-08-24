import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ReportTable = ({ groupedData, handleCostChange }) => {
    const [excelData, setExcelData] = useState({}); // State to store the Excel data

    const handleFileUpload = (file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract barcode and cost price
            const extractedData = jsonData.slice(1).reduce((acc, row) => {
                const barcode = row[0];
                let costPrice = row[1];
                
                if (typeof costPrice === 'number') {
                    costPrice = costPrice.toFixed(2);
                } else if (typeof costPrice === 'string') {
                    costPrice = costPrice.replace(',', '.');
                } else {
                    costPrice = null;
                }

                acc[barcode] = parseFloat(costPrice);
                return acc;
            }, {});

            setExcelData(extractedData); // Store the extracted data in state

            // Update the table with the new cost prices
            Object.entries(extractedData).forEach(([barcode, costPrice]) => {
                if (!isNaN(costPrice)) {
                    handleCostChange(barcode, costPrice);
                }
            });
        };

        reader.readAsArrayBuffer(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            handleFileUpload(file);
        } else {
            alert('Please upload a valid Excel file.');
        }
    };

    return (
        <div>
            {/* File Upload Input */}
            <div className="mb-4">
                <input 
                    type="file" 
                    accept=".xlsx" 
                    onChange={handleFileChange}
                    className="border p-2"
                />
            </div>
            
            {/* Table Display */}
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
                                            value={
                                                excelData[item.barcode] !== undefined
                                                    ? excelData[item.barcode] // Use value from Excel if available
                                                    : item.productCost
                                            }
                                            onChange={(e) => handleCostChange(item.barcode, e.target.value)}
                                            className="border border-gray-200 p-2 max-w-20 mx-2"
                                            placeholder="Enter Cost"
                                        />
                                        X {item?.quantity} = {(excelData[item.barcode] || item.productCost) * item.quantity}
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
        </div>
    );
};

export default ReportTable;
