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
                <WarehousesWrapper authUser={authUser} authUserLoading={authUserLoading} authUserError={authUserError} />
            </Container>
        </div>
    )
}

export default Warehouses