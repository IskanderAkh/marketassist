import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddProductButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        barcode: '',
        threshold: '',
        changeRatio: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async () => {
        try {
            await axios.post('/api/reprice/add-product', newProduct);
            toast.success("Product added successfully");
            setIsOpen(false);  // Close modal on success
            setNewProduct({ barcode: '', threshold: '', changeRatio: '' });
        } catch (error) {
            toast.error("Failed to add product");
        }
    };

    return (
        <>
            <button className="btn btn-primary mb-4" onClick={() => setIsOpen(true)}>
                Add Product
            </button>
            
            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add New Product</h3>
                        
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Barcode</span>
                            </label>
                            <input
                                type="text"
                                name="barcode"
                                value={newProduct.barcode}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="Enter barcode"
                            />
                        </div>
                        
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Threshold</span>
                            </label>
                            <input
                                type="number"
                                name="threshold"
                                value={newProduct.threshold}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="Enter threshold"
                            />
                        </div>

                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Change Ratio</span>
                            </label>
                            <input
                                type="number"
                                name="changeRatio"
                                value={newProduct.changeRatio}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="Enter change ratio"
                            />
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setIsOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddProduct}>Add Product</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddProductButton;
