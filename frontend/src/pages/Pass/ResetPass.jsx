import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useResetPassword from '../../hooks/useResetPassword';
import eyeClose from './eyeClose.svg'
import eyeOpen from './eyeOpen.svg'
const ResetPass = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const { resetPassword, loading, error, success } = useResetPassword();
    const [showPass, setShowPass] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        resetPassword({ token, newPassword });
    };
    const handleShowPass = (e) => {
        e.preventDefault()
        setShowPass(!showPass);
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded">
                <h2 className="text-2xl font-semibold text-center">Сброс пароля</h2>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">Пароль успешно сброшен!</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Новый пароль
                        </label>
                        <div className="flex gap-4">
                            <input
                                id="password"
                                type={showPass ? "text" : "password"}
                                placeholder="Введите новый пароль"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button onClick={handleShowPass} className="border-none outline-none"><img className="w-6 h-6" src={showPass ? eyeClose : eyeOpen} title={showPass ? "Скрыть пароль" : "Показать пароль"} alt="" /></button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? 'Обновляем...' : 'Обновить пароль'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPass;
