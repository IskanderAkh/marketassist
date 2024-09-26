import React, { useState } from 'react';
import Container from "@/components/ui/Container";
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setMessage('Если этот email зарегистрирован, вы получите ссылку для сброса пароля.');
            setError('');
        } catch (err) {
            setError('Что-то пошло не так. Попробуйте еще раз.');
            setMessage('');
        }
    };

    return (
        <Container>
            <div className="flex justify-center items-center h-screen bg-base-200">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-center">Восстановление пароля</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label" htmlFor="email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered"
                                    placeholder="Введите свою электронную почту"
                                    required
                                />
                            </div>
                            {message && <p className="text-green-500 mt-2">{message}</p>}
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            <div className="form-control mt-4">
                                <button type="submit" className="btn btn-primary">
                                    Сбросить пароль
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ForgotPassword;
