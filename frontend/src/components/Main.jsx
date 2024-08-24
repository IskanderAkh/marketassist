import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../pages/Auth/Auth'
import Profile from '../pages/Profile/Profile'
import AppAnalytics from '../pages/Analytics/AppAnalytics'
import Reviews from '../pages/Reviews/Reviews'
import AppReviews from '../pages/Reviews/AppReviews'
import Home from '../pages/Home/Home'
import Analytics from '../pages/Analytics/Analytics'

const Main = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/analytics' element={<Analytics />} />
                <Route path='/app-analytics' element={<AppAnalytics />} />
                <Route path='/reviews' element={<Reviews />} />
                <Route path='/app-reviews' element={<AppReviews />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </div>
    )
}

export default Main