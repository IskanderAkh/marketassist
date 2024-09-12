import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'

const useVerifyEmail = () => {
    const queryClient = useQueryClient();

    const { mutate: verifyEmail, isPending, isError } = useMutation({
        mutationFn: async (code, email) => {
            try {
                const res = await axios.post('/api/auth/verify-email', {
                    code,
                    email: email,
                })
                return res.data
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            toast.success("Почта успшно подтверждена")
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Ошибка при проверке почты");
        }
    })
    return { verifyEmail }
}

export default useVerifyEmail