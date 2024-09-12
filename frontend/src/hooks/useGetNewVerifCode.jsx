import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useGetNewVerifCode = () => {
    const queryClient = useQueryClient();

    const { mutate: getNewVerifCode, isPending: isPendingNewVerifCode, isError: isErrorNewVerifCode } = useMutation({
        mutationFn: async (email) => {
            try {
                const res = await axios.post('/api/auth/request-new-verification-code', { email: email });
                return res.data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Код был повторно отправлен");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
    return { getNewVerifCode };
}

export default useGetNewVerifCode;
