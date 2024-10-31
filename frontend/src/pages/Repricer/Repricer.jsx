import React, { useEffect } from 'react';
import Container from "@/components/ui/Container";
import { useFetchUser, useFetchUserBarcodes } from '@/store/useUserStore.js';

import RepricerAddProductModal from '@/components/Modals/RepricerAddProductModal';

const Repricer = () => {
    const { data: authUser, isLoading: isLoadingUser, isError: isUserError, error: userError } = useFetchUser();
    const { barcodes: userBarcodes, isLoading: isLoadingBarcodes, error: barcodesError } = useFetchUserBarcodes();

    if (isLoadingUser || isLoadingBarcodes) return <p>Loading...</p>;
    if (isUserError) return <p>Error: {userError.message}</p>;
    if (barcodesError) return <p>Error: {barcodesError.message}</p>;

    return (
        <Container>
            <div className='mt-20'>
                <div className='w-full flex justify-end'>
                    <button className='btn btn-neutral' onClick={() => document.getElementById('my_modal_3').showModal()}>
                        Добавить товар
                    </button>
                </div>
                <RepricerAddProductModal authUser={authUser} userBarcodes={userBarcodes} />
            </div>
        </Container>
    );
};

export default Repricer;
