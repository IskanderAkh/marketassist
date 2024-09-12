import axios from "axios"
import { useQuery } from '@tanstack/react-query';

const useGetAllPlans = () => {
    const { data: plans } = useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            try {
                const res = await axios.get('/api/plans/getAllPlans')
                return res.data
            } catch (error) {
                console.log(error);
            }
        }
    })
    return { plans }
}

export default useGetAllPlans