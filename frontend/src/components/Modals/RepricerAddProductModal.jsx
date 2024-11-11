import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';

const RepricerAddProductModal = ({ authUser, userBarcodes }) => {
    const [selectedBarcodes, setSelectedBarcodes] = useState([]);
    const [conditions, setConditions] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingBarcodes, setExistingBarcodes] = useState([]);

    useEffect(() => {
        if (authUser) {
            axios.get('/api/reprice/get-existing-barcodes')
            .then(response => {                
                setExistingBarcodes(response.data.barcodes);
            })
            .catch(error => console.error('Error fetching existing barcodes:', error));
        }
    }, [authUser]);

    const filteredBarcodes = userBarcodes?.filter(barcode => !existingBarcodes?.includes(barcode.barcode));

    const handleCheckboxChange = (barcode) => {
        setSelectedBarcodes((prevSelected) =>
            prevSelected.includes(barcode.barcode)
                ? prevSelected.filter((b) => b !== barcode.barcode)
                : [...prevSelected, barcode.barcode]
        );
    };

    const handleConditionChange = (barcode, field, value) => {
        setConditions((prevConditions) => ({
            ...prevConditions,
            [barcode]: {
                ...prevConditions[barcode],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await Promise.all(
                selectedBarcodes.map(async (barcode) => {
                    const { stock, priceChange } = conditions[barcode] || {};
                    await axios.post('/api/reprice/set-product-reprice', {
                        barcode: barcode,
                        threshold: stock,
                        changeRatio: priceChange,
                    });
                })
            );
            document.getElementById('my_modal_3').close();
        } catch (error) {
            console.error('Не удалось установить переоценку продукта:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-3xl">
                    <form method="dialog" onSubmit={(e) => e.preventDefault()}>
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => document.getElementById('my_modal_3').close()}
                        >
                            ✕
                        </button>

                        <div className="mt-4">
                            <h3 className="text-lg font-medium">Выберите продукт для добавления в реплейс</h3>
                            <ul>
                                {filteredBarcodes?.map((barcode, i) => (
                                    <li key={i} className="my-4">
                                        <div className="flex items-center space-x-4 text-center">
                                            <Checkbox
                                                checked={selectedBarcodes.includes(barcode.barcode)}
                                                onCheckedChange={() => handleCheckboxChange(barcode)}
                                            />
                                            <span>{barcode.barcode}</span>

                                            {selectedBarcodes.includes(barcode.barcode) && (
                                                <div className="flex space-x-2 items-center">
                                                    <input
                                                        type="number"
                                                        placeholder="Порог Запаса"
                                                        className="input input-bordered"
                                                        value={conditions[barcode.barcode]?.stock || ''}
                                                        onChange={(e) =>
                                                            handleConditionChange(barcode.barcode, 'stock', e.target.value)
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Изменение цены (%)"
                                                        className="input input-bordered"
                                                        value={conditions[barcode.barcode]?.priceChange || ''}
                                                        onChange={(e) =>
                                                            handleConditionChange(barcode.barcode, 'priceChange', e.target.value)
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button 
                            className="btn btn-primary mt-4" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Сохраняю...' : 'Добавить'}
                        </button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default RepricerAddProductModal;
