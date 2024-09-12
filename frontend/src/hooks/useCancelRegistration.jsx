import { useMutation } from '@tanstack/react-query'
import React from 'react'

const useCancelRegistration = () => {

    const { mutate: cancelRegistration } = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/auth/cancel-registration', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Что -то пошло не так');
            }
            return data;
        },
        onSuccess: () => {
            window.location.reload();
        },
        onError: (error) => {
            console.error(error);
        }
    })
    return { cancelRegistration };
}

export default useCancelRegistration