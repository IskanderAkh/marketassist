import React, { useState } from 'react';
import TableRow from './TableRow';
import TaxToggle from './TaxToggle';
import { useExportToExcel } from './useExportToExcel';

const ReportTable = ({ groupedData, handleCostChange, logisticsCount, recalculationOfPaidAcceptance, storage, retention }) => {
    const [excelData, setExcelData] = useState({});
    const [tax, setTax] = useState(0.07);
    const [columnType, setColumnType] = useState('Баркод'); // Holds the selected column type
    const [kkk, setKkk] = useState('Компенсация ущерба')
    const exportToExcel = useExportToExcel(groupedData, excelData, tax);
    const [operationalCosts, setOperationalCosts] = useState(0)
    const calculateTotalFinalResult = () => {
        return groupedData.reduce((total, item) => {
            const finalResult = item.totalPrice
                - item.productCost * item.quantity
                - (item.totalPrice * tax)
                - item.logisticsCost
                - item.compensation
                + item.compensationForDamages
                + item.acquiringAdjustments
                + item.salesAdjustment;

            return total + finalResult;
        }, 0);
    };
    const handleOperationalCostsChange = (event) => {
        setOperationalCosts(event.target.value);
    }
    const handleColumnChange = (event) => {
        setColumnType(event.target.value);
    };
    const handleKkkColumnChange = (event) => {
        setKkk(event.target.value);
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
                <table className="table table-sm">
                    <thead>
                        <tr className='font-bold text-black text-base'>
                            <th  >
                                <label>
                                    <select value={columnType} onChange={handleColumnChange} className="select select-bordered">
                                        <option value="Баркод">Баркод</option>
                                        <option value="Артикул поставщика">Артикул поставщика</option>
                                    </select>
                                </label>
                            </th>
                            <th>Wildberries реализовал</th>
                            <th>Себестоимость</th>
                            <th>Налог ({(tax * 100).toFixed(0)}%)</th>
                            <th>Логистика</th>
                            <th>Возмещение/Возврат</th>
                            <th>
                                <label>
                                    <select value={kkk} onChange={handleKkkColumnChange} className="select select-bordered">
                                        <option value="Компенсация ущерба">Компенсация ущерба</option>
                                        <option value="Коррекция продаж">Коррекция продаж</option>
                                        <option value="Корректировка эквайринга">Корректировка эквайринга</option>
                                    </select>
                                </label>
                            </th>
                            <th>Конечный итог</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedData?.map((item, i) => (
                            <TableRow
                                key={i}
                                item={item}
                                tax={tax}
                                excelData={excelData}
                                handleCostChange={handleCostChange}
                                logisticsCount={logisticsCount}
                                columnType={columnType}
                                kkk={kkk}
                            />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className='my-10'>
                            <th colSpan="5"></th>
                            <th className='font-semibold text-base flex gap-0.5 items-center'>
                                <label className='border px-3 py-1 flex gap-1'>
                                    <span className='text-black'>₽</span>
                                    <input
                                        type="number"
                                        value={operationalCosts}
                                        disabled={groupedData.length == 0}
                                        onChange={handleOperationalCostsChange}
                                        placeholder="Операционные расходы"
                                        className="operationalCosts-input outline-none text-sm" />
                                </label>
                            </th>
                            <th className='text-black font-bold text-lg pr-5'>Итог:</th>
                            <th className='text-black font-bold text-lg'> ₽ {(calculateTotalFinalResult() - operationalCosts).toFixed(2)}</th>
                        </tr>
                        <tr className='border-t border-black'>
                            <th colSpan="2" className='font-bold text-black text-base'>Итог с учетом следующих данных</th>
                            <th colSpan="1"></th>
                            <th className='font-semibold text-base'>Хранение: <br /> <span className='text-black'>₽ {retention}</span></th>
                            <th className='font-semibold text-base'>Удержание: <br /><span className='text-black'> ₽ {storage} </span></th>
                            <th className='font-semibold text-base'>Пересчет платной приемки: <br /> <span className='text-black'>₽ {recalculationOfPaidAcceptance.toFixed(2)}</span> </th>
                            <th className='text-black font-bold text-lg pr-5'>Итог:</th>

                            <th className='font-bold text-lg'>₽ {(calculateTotalFinalResult() - recalculationOfPaidAcceptance - retention - storage).toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ReportTable;
