import axios from 'axios';
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';

export const useUserStore = create((set) => ({
    authUser: null,
    userBarcodes: [],
    isUserError: null,
    isLoadingUser: true,
    setUserBarcodes: (barcodes) => set({ userBarcodes: barcodes }),
    setUser: (user) => set({ authUser: user, isLoadingUser: false, isUserError: null }),
    setUserError: (error) => set({ isUserError: error, isLoadingUser: false }),
    clearUser: () => set({ authUser: null, isUserError: null, isLoadingUser: false })
}));

//barcodes
const fetchUserBarcodes = async () => {
    try {
        const response = await axios.get(`/api/user/barcodes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user barcodes:', error);
        return [];
    }
};

export const useFetchUserBarcodes = () => {
    const { setUserBarcodes } = useUserStore();
    const { data: barcodes, isLoading, error } = useQuery({
        queryKey: ['userBarcodes'],
        queryFn: () => fetchUserBarcodes(),
        onSuccess: (data) => setUserBarcodes(data),
        onError: (err) => {
            console.error('Error fetching barcodes:', err);
        }
    });

    return { barcodes, isLoading, error };
};
// getMe
export const useFetchUser = () => {
    const { setUser, setUserError, clearUser } = useUserStore();

    return useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await axios.get('/api/auth/me', {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (data) => setUser(data),
        onError: (error) => {
            const errorMessage = error.response?.data?.error || 'Ошибка при загрузке данных пользователя';
            setUserError(errorMessage);
            console.error('Ошибка в fetchUser:', error);
        },
        onSettled: () => useUserStore.setState({ isLoadingUser: false })
    });
};
