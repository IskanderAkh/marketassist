import React from 'react';
import * as XLSX from 'xlsx';

const FileUploader = ({ setExcelData, handleCostChange, groupedData }) => {
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

    return (
        <div className="mb-4">
            <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="border p-2"
                disabled={!groupedData.length}
            />
        </div>
    );
};

export default FileUploader;
