import React, { useState } from 'react';
import * as XLSX from 'xlsx';


const ReportTable = ({ groupedData, handleCostChange, hasFetchedData }) => {
    const exportToExcel = () => {
        const filteredData = groupedData.filter(item => item.barcode);

        const worksheetData = filteredData.map(item => ({
            'Баркод': item.barcode,
            'Wildberries реализовал': parseFloat(item.totalPrice.toFixed(2)),
            'Себестоимость': parseFloat(((excelData[item.barcode] || item.productCost) * item.quantity).toFixed(2)),
            'Налог': parseFloat((item.totalPrice * tax).toFixed(2)),
            'Логистика': parseFloat(item.logisticsCost.toFixed(2)),
            'Конечный итог': parseFloat((
                item.totalPrice
                - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity
                - (item.totalPrice * tax)
                - item.logisticsCost
            ).toFixed(2))
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        Object.keys(worksheet).forEach(cell => {
            if (worksheet[cell].t === 'n') {
                worksheet[cell].z = '#,##0.00';
            }
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        XLSX.writeFile(workbook, 'report.xlsx');
    };
    const [excelData, setExcelData] = useState({});
    const [tax, setTax] = useState(0.15);

    const handleFileUpload = (file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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

            setExcelData(extractedData);

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

    const handleTaxChange = () => {
        setTax(prevTax => (prevTax === 0.15 ? 0.07 : 0.15))
    }

    const calculateTotalFinalResult = () => {
        return groupedData
            .filter(item => item.barcode) 
            .reduce((total, item) => {
                const finalResult = item.totalPrice
                    - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity
                    - (item.totalPrice * tax)
                    - item.logisticsCost;
                return total + finalResult;
            }, 0);
    };


    return (
        <div>
            <div>
                <div className="form-control w-52 flex flex-row">
                    <span className="label-text font-bold w-full">Выберите налог</span>
                    <label className="label cursor-pointer">
                        <div className='flex items-center gap-2'>
                            7%
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked onClick={handleTaxChange} />
                            15%
                        </div>
                    </label>
                </div>
            </div>

            {!groupedData.length && (
                <div className="mb-4 text-red-500">
                    Пожалуйста, сначала загрузите данные с API.
                </div>
            )}


            <div className="mb-4">
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="border p-2"
                    disabled={!groupedData.length}
                />
            </div>

            <div className='w-full flex items-center justify-end'>
                <button onClick={exportToExcel} className="btn btn-primary mb-4" disabled={!groupedData.length}>
                    Сохранить таблицу в Excel
                </button>
            </div>
            <div id="table-container" className="overflow-x-auto ">

                <table className="table table-xs ">
                    <thead>
                        <tr>
                            <th>Баркод</th>
                            <th>Wildberries реализовал</th>
                            <th>Себестоимость</th>
                            <th>Налог ({(tax * 100).toFixed(0)}%)</th>
                            <th>Логистика</th>
                            <th>Конечный итог</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            groupedData?.map((item, i) => {
                                const finalResult = item.totalPrice
                                    - (excelData[item.barcode] !== undefined ? excelData[item.barcode] : item.productCost) * item.quantity
                                    - (item.totalPrice * tax)
                                    - item.logisticsCost;

                                return item.barcode && (
                                    <tr key={i} className='text-black'>
                                        <td>{item.barcode}</td>
                                        <td>₽ {item.totalPrice.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={
                                                    excelData[item.barcode] !== undefined
                                                        ? excelData[item.barcode]
                                                        : item.productCost
                                                }
                                                onChange={(e) => handleCostChange(item.barcode, e.target.value)}
                                                className="border border-gray-200 p-2 max-w-20 mx-2"
                                                placeholder="Enter Cost"
                                            />
                                            X {item?.quantity} = ₽{(excelData[item.barcode] || item.productCost) * item.quantity}
                                        </td>
                                        <td>₽ {(item.totalPrice * tax).toFixed(2)}</td>
                                        <td>₽ {item.logisticsCost.toFixed(2)}</td>
                                        <td>₽ {finalResult.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="5" className="text-right text-black font-semibold text-lg">Итог:</th>
                            <th className='text-black font-bold text-lg'>₽ {calculateTotalFinalResult().toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ReportTable;
