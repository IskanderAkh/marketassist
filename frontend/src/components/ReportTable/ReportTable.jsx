import React, { useState } from 'react';
import TableRow from './TableRow';
import FileUploader from './FileUploader';
import TaxToggle from './TaxToggle';
import { useExportToExcel } from './useExportToExcel';

const ReportTable = ({ groupedData, handleCostChange, logisticsCount }) => {
    const [excelData, setExcelData] = useState({});
    const [tax, setTax] = useState(0.07);

    const exportToExcel = useExportToExcel(groupedData, excelData, tax,);

    const calculateTotalFinalResult = () => {
        return groupedData
            .reduce((total, item) => {
                const finalResult = item.totalPrice
                    - item.productCost * item.quantity
                    - (item.totalPrice * tax)
                    - item.logisticsCost
                    - item.compensation;
                return total + finalResult;
            }, 0);
    };

    return (
        <div>

           

            <div className='w-full flex items-center justify-between mb-10'>
                <TaxToggle tax={tax} setTax={setTax} />
                <button onClick={exportToExcel} className="btn btn-primary mb-4 btn-wide btn-outline" disabled={!groupedData.length}>
                    Вывести таблицу в Excel
                </button>
            </div>

            <div id="table-container" className="overflow-x-auto border p-4">
                <table className="table table-xs">
                    <thead>
                        <tr className='font-bold text-black text-base'>
                            <th>Баркод</th>
                            <th>Wildberries реализовал</th>
                            <th>Себестоимость</th>
                            <th>Налог ({(tax * 100).toFixed(0)}%)</th>
                            <th>Логистика</th>
                            <th>Возмещение/Возврат</th>
                            <th>Конечный итог</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedData.map((item, i) => (
                            <TableRow
                                key={i}
                                item={item}
                                tax={tax}
                                excelData={excelData}
                                handleCostChange={handleCostChange}
                                logisticsCount={logisticsCount}
                            />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="6" className="text-right text-black font-semibold text-lg">Итог:</th>
                            <th className='text-black font-bold text-lg'>₽ {calculateTotalFinalResult().toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ReportTable;
