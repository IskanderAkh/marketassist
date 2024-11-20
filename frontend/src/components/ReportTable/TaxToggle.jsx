import React from 'react';
import styles from './TaxToggle.module.scss';

const TaxToggle = ({ tax, setTax }) => {
    const handleTaxChange = () => {
        setTax(prevTax => (prevTax === 0.15 ? 0.07 : 0.15));
    };

    return (
        <div className={styles['tax-toggle']}>
            <span className={`${styles['label-text']} font-rfBold text-xl`}>Выберите налог</span>
            <div
                className={`${styles['toggle-wrapper']} ${tax === 0.15 ? styles.active : ''} `}
                onClick={handleTaxChange}
            >
                <div className={styles['toggle-wrapper-div']}>
                    {/* <span className={`${styles.percentage} ${tax === 0.07 ? styles.active : ''}`}>7%</span> */}
                    <div className={`${styles['toggle-circle']} font-rfBlack`}>{tax === 0.07 ? '7%' : '15%'}</div>
                    {/* <span className={`${styles.percentage} ${tax === 0.15 ? styles.active : ''}`}>15%</span> */}
                </div>
            </div>
        </div>
    );
};

export default TaxToggle;
