import React from 'react';
import HomeDescription from '../../components/Home/HomeDescription';
import { useFetchUser, useUserStore } from '@/store/useUserStore';
import { Navigate } from 'react-router-dom';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Home = () => {
  const { data: authUser, isLoading, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/auth/me')
        return res.data
      } catch (error) {
        console.log(error);
      }
    },
    retry: false
  })
  // Initiate fetchUser only if authUser is not already loaded

  if (isLoading) {
    return <div></div>
  }

  return (
    <div>
      {!authUser && <HomeDescription />}
      {authUser && <Navigate to={'/app-calculator'} />}
    </div>
  );
};

export default Home;
