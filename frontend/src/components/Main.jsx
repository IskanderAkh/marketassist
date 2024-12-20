import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from '../pages/Auth/Auth';
import Profile from '../pages/Profile/Profile';
import AppCalculator from '../pages/Calculator/AppCalculator';
import Reviews from '../pages/Reviews/Reviews';
import AppReviews from '../pages/Reviews/AppReviews';
import Home from '../pages/Home/Home';
import Calculator from '../pages/Calculator/Calculator';
import Contact from '../pages/Contact/Contact';
import ProductCost from '../pages/ProductCost/ProductCost';
import { useQuery } from '@tanstack/react-query';
import ForgotPass from '../pages/Pass/ForgotPass';
import ResetPass from '../pages/Pass/ResetPass';
import Warehouses from '../pages/Warehouses/Warehouses';
import ChatAI from '../pages/ChatAI/ChatAI';
import Repricer from '@/pages/Repricer/Repricer';
import FAQ from '@/pages/FAQ/FAQ';
import ScrollToTop from './ScrollToTop';

const Main = ({ authUser, authUserLoading, authUserError }) => {
    const RedirectAuthenticatedUser = ({ children }) => {
        if (authUser) {
            return <Navigate to='/profile' replace />;
        }
        return children;
    };
    
    

    const ProtectedRoute = ({ children }) => {
        if (!authUser && !authUserLoading) {
            return <Navigate to='/auth' replace />;
        }
        return children;
    };

    return (
        <div className='flex-[1_0_auto]'>
            <ScrollToTop /> {/* Add this component */}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/Auth/:pagename' element={<Auth />} />
                <Route path='/calculator' element={<Calculator />} />
                <Route path='/app-calculator' element={<ProtectedRoute><AppCalculator /></ProtectedRoute>} />
                <Route path='/reviews' element={<Reviews />} />
                <Route path='/app-reviews' element={<ProtectedRoute><AppReviews /></ProtectedRoute>} />
                <Route path='/profile/:pagename' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/questions' element={<FAQ />} />
                <Route path='/repricer' element={<Repricer />} />
                <Route path='/chat-ai' element={<ProtectedRoute><ChatAI /></ProtectedRoute>} />
                <Route path='/warehouses' element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
                <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPass /></RedirectAuthenticatedUser>} />
                <Route path='/password-reset/:token' element={<RedirectAuthenticatedUser><ResetPass /></RedirectAuthenticatedUser>} />
                <Route path='/product-cost' element={<ProtectedRoute><ProductCost /></ProtectedRoute>} />
                <Route path='*' element={<Home />} />
            </Routes>
        </div>
    );
};

export default Main;
