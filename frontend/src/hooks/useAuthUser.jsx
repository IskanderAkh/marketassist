import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import React from 'react'

const useAuthUser = () => {
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/auth/me");
                return res.data;
            } catch (error) {
                console.log(error);
            }
        },
    })
    return authUser;
}

export default useAuthUser