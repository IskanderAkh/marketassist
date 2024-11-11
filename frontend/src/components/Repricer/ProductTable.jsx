// components/ProductTable.js
import React from 'react';
import ProductRow from './ProductRow';

const ProductTable = ({ products, onEdit, onSave, onDelete }) => (
    <table className="table-auto w-full mt-4">
        <thead>
            <tr>
                <th>Штрих-код</th>
                <th>SCCode</th>
                <th>Бренд</th>
                <th>Предмет</th>
                <th>Цена</th>
                <th>Скидка</th>
                <th>Порог</th>
                <th>Коэффициент изменений</th>
                <th>Общее количество</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            {products.map(product => (
                <ProductRow
                    key={product.barcode}
                    product={product}
                    onEdit={onEdit}
                    onSave={onSave}
                    onDelete={onDelete}
                />
            ))}
        </tbody>
    </table>
);

export default ProductTable;
