import React from 'react'
import Container from "@/components/ui/Container";
import WarehousesWrapper from '../../components/Warehouses/WarehousesWrapper';
import { useQuery } from '@tanstack/react-query';
import LoadingPage from '../../components/LoadingPage/LoadingPage';

const Warehouses = () => {
    const { data: authUser, isLoading: authUserLoading, isError: authUserError } = useQuery({ queryKey: ['authUser'] })
    if (authUserLoading) {
        return <LoadingPage />
    }
    return (
        <div>
            <Container>
                <div className='flex items-center justify-center'>
                    <h1 className='uppercase font-rfBlack page-title text-center gradient-color mx-auto mt-24 mb-10'>Поиск Лимитов</h1>
                </div>
                <WarehousesWrapper authUser={authUser} authUserLoading={authUserLoading} authUserError={authUserError} />
            </Container>
        </div>
    )
}

export default Warehouses