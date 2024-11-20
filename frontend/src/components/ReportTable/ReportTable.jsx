import React, { useState } from 'react';
import TableRow from './TableRow';
import TaxToggle from './TaxToggle';
import { useExportToExcel } from './useExportToExcel';

const ReportTable = ({ groupedData, handleCostChange, logisticsCount, recalculationOfPaidAcceptance, storage, retention }) => {
    const [excelData, setExcelData] = useState({});
    const [tax, setTax] = useState(0.07);
    const [columnType, setColumnType] = useState('Баркод');
    const [showPenalty, setShowPenalty] = useState('Возмещение/Возврат')
    const [kkk, setKkk] = useState('Компенсация ущерба')
    const exportToExcel = useExportToExcel(groupedData, excelData, tax);
    const [operationalCosts, setOperationalCosts] = useState(0)
    const calculateTotalFinalResult = () => {
        return groupedData.reduce((total, item) => {
            const finalResult = item.transferGoodsToSeller
                - item.productCost * item.quantity
                - (item.totalPrice * tax)
                - item.logisticsCost
                - item.compensation
                - item.penalty
                + item.compensationForDamages
                + item.acquiringAdjustments
                + item.salesAdjustment

            return total + finalResult;
        }, 0);
    };
    const handlePenaltyChange = (event) => {
        setShowPenalty(event.target.value)
    }
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

            <div id="table-container" className="overflow-x-auto p-4">
                <table className="table table-xs">
                    <thead>
                        <tr className='font-bold text-black text-base'>
                            <th >
                                <label>
                                    <select value={columnType} onChange={handleColumnChange} className="select">
                                        <option value="Баркод">Баркод</option>
                                        <option value="Артикул поставщика">Артикул поставщика</option>
                                    </select>
                                </label>
                            </th>
                            <th>К перечислению Продавцу</th>
                            <th>Себестоимость</th>
                            <th>Налог ({(tax * 100).toFixed(0)}%)</th>
                            <th>Логистика</th>

                            <th className=''>
                                <label>
                                    <select value={showPenalty} onChange={handlePenaltyChange} className="select">
                                        <option value="Возмещение/Возврат">Возмещение/Возврат</option>
                                        <option value="Штрафы">Штрафы</option>
                                    </select>

                                </label>
                            </th>
                            <th>
                                <label>
                                    <select value={kkk} onChange={handleKkkColumnChange} className="select">
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
                                showPenalty={showPenalty}
                            />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className='my-10'>
                            <th colSpan="6"></th>

                            <th className='text-black font-bold text-lg pr-5'>Итог:</th>
                            <th className='text-black font-bold text-lg'> ₽ {calculateTotalFinalResult().toFixed(2)}</th>
                        </tr>
                        <tr className=' '>
                            <th colSpan="2" className='font-bold text-black text-base'>Итог с учетом следующих данных</th>
                            <th className='font-semibold text-base'>Хранение: <br /> <span className='text-black'>₽ {storage.toFixed(2)}</span></th>
                            <th className='font-semibold text-base'>Удержание: <br /><span className='text-black'> ₽ {retention.toFixed(2)} </span></th>
                            <th colSpan="2" className='font-semibold text-base'>Пересчет платной приемки: <br /> <span className='text-black'>₽ {recalculationOfPaidAcceptance.toFixed(2)}</span> </th>
                            <th className='font-semibold text-base flex flex-col gap-0.5 items-start'>
                                <p>Операционные расходы</p>
                                <label className=' py-1 flex gap-1'>
                                    <div className="input-wrapper relative flex items-center">
                                        <input
                                            type="number"
                                            value={operationalCosts}
                                            disabled={groupedData.length == 0}
                                            onChange={handleOperationalCostsChange}
                                            className="operationalCosts-input max-w-32"
                                        />
                                        <span className='absolute right-4 '>₽</span>
                                    </div>

                                </label>
                            </th>
                            {/* <th className='text-black font-bold text-lg pr-5'></th> */}
                            <th className='font-bold text-lg'> Итог: ₽ {(calculateTotalFinalResult() - recalculationOfPaidAcceptance - retention - storage - operationalCosts).toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ReportTable;
