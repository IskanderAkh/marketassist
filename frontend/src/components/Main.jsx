import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../pages/Auth/Auth'
import Profile from '../pages/Profile/Profile'
import AppCalculator from '../pages/Calculator/AppCalculator'
import Reviews from '../pages/Reviews/Reviews'
import AppReviews from '../pages/Reviews/AppReviews'
import Home from '../pages/Home/Home'
import Calculator from '../pages/Calculator/Calculator'
import Contact from '../pages/Contact/Contact'
import ProductCost from '../pages/ProductCost/ProductCost'
import { useQuery } from '@tanstack/react-query'

const Main = () => {
    const { data: authUser, isLoading: authUserLoading, isError: authUserError } = useQuery({ queryKey: ['authUser'] })
    
    return (
        <div className='flex-[1_0_auto]'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/calculator' element={<Calculator />} />
                <Route path='/app-calculator' element={<AppCalculator authUser={authUser} authUserLoading={authUserLoading} authUserError={authUserError} />} />
                <Route path='/reviews' element={<Reviews />} />
                <Route path='/app-reviews' element={<AppReviews authUser={authUser} authUserLoading={authUserLoading} authUserError={authUserError} />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/product-cost' element={<ProductCost authUser={authUser} authUserLoading={authUserLoading} authUserError={authUserError} />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </div>
    )
}

export default Main