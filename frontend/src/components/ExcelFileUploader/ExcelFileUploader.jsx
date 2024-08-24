import React from 'react';

const ExcelFileUploader = ({ onFileUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            onFileUpload(file);
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
            />
        </div>
    );
};

export default ExcelFileUploader;
