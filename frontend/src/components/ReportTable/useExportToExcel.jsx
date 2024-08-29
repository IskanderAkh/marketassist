import * as XLSX from 'xlsx';

export const useExportToExcel = (groupedData, excelData, tax) => {
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

        
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    font: {
                        bold: true
                    }
                };
            }
        }

        if (!worksheet['!cols']) {
            worksheet['!cols'] = [];
        }
        for (let C = range.s.c; C <= range.e.c; ++C) {
            worksheet['!cols'][C] = { wpx: 100 };
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        XLSX.writeFile(workbook, 'report.xlsx', { bookType: 'xlsx', cellStyles: true });
    };

    return exportToExcel;
};
