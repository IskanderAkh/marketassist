import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useLogout from "@/hooks/useLogout";
import useCancelRegistration from "@/hooks/useCancelRegistration";
import useVerifyEmail from "@/hooks/useVerifyEmail";
import useGetNewVerifCode from "@/hooks/useGetNewVerifCode"
import { LogOut } from "lucide-react";
import './unverified.scss'

const UnverifiedUser = ({ authUser }) => {
    const { cancelRegistration } = useCancelRegistration()
    const { logout } = useLogout();
    const { verifyEmail } = useVerifyEmail()
    const { getNewVerifCode } = useGetNewVerifCode()
    const [code, setCode] = useState("")

    const verif = () => {
        verifyEmail(code, authUser.email)
    }



    return (
        <div className="unverified-email">
            <h1 className="text-center my-10 ">Здравствуйте, {authUser.firstName}!</h1>
            <div role="alert" className="alert alert-warning mt-10">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Предупреждение: Не подтвержденный адрес электронной почты!</span>
                <div className="flex gap-4">
                    <input type="text" placeholder="Введите код" className="input input-bordered w-full max-w-xs" value={code} onChange={e => setCode(e.target.value)} />
                    <button className="btn btn-wide btn-primary " onClick={verif}>Подтвердить почту</button>
                </div>
            </div>

            <div className="py-5 w-full flex justify-end gap-16">
                <div className="flex gap-5">
                    <button className="btn btn-wide btn-secondary btn-outline" onClick={() => getNewVerifCode(authUser.email)} title="Получить новый код подтверждения">Запросить новый код</button>
                    <button className="btn btn-wide btn-warning btn-outline" onClick={logout} >
                        Выйти из аккаунта <LogOut />
                    </button>
                </div>
                <div>
                    <button title="Отменить регистрацию и удалить аккаунт" className="btn btn-wide btn-error btn-outline" onClick={cancelRegistration}>
                        Отменить регистрацию
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnverifiedUser;
