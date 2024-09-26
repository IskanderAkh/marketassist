import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useResetPassword = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        mutate: resetPassword,
        isLoading: isLoadingResetPassword,
        isError: isErrorResetPassword,
        isSuccess: isSuccessResetPassword
    } = useMutation({
        mutationFn: async ({ token, newPassword }) => {
            try {
                const res = await axios.post(`/api/auth/password-reset/${token}`, { newPassword });
                return res.data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Пароль успешно сброшен");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate('/auth');
        },
        onError: (error) => {
            toast.error(error.response.data.error);
        }
    });

    return { resetPassword, isLoadingResetPassword, isErrorResetPassword, isSuccessResetPassword };
};

export default useResetPassword;
