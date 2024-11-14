import React, { useState } from 'react';
import Container from "@/components/ui/Container";
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleRequest()
    };

    const { mutate: handleRequest } = useMutation({
        mutationFn: async () => {
            try {
                const res = await axios.post('/api/auth/forgot-password', { email });
                return res.data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Вам отправлено письмо на почту для сброса пароля")
        },
        onError: () => {
            toast.error("Что-то пошло не так. Попробуйте еще раз.")
        }
    })

    return (
        <Container>
            <section className="flex justify-center items-center h-screen forgot-password mt-20">
                <div className=" forgot-password-card">
                    <div className="">
                        <h2 className="text-center forgot-password-card-title font-rfBlack gradient-color">Восстановление пароля</h2>
                        <form onSubmit={handleSubmit} className='mt-56 w-full gap-4 forgot-password-card-form'>
                            <div className='w-full forgot-password-card-input relative'>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none"
                                    placeholder="Введите свою электронную почту"
                                    required
                                />
                            </div>

                            <div className='relative forgot-password-card-btn'>
                                <button type="submit" className=" mt-0 login-btn font-rfBold">
                                    Сбросить пароль
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default ForgotPassword;
