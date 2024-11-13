import React from 'react'
import HomeDescription from '../../components/Home/HomeDescription'
import { useFetchUser } from '@/store/useUserStore'
import { Navigate } from 'react-router-dom';
import LoadingPage from '@/components/LoadingPage/LoadingPage';

const Home = () => {
  const { data: authUser, isLoading: isLoadingUser, isError: isUserError, error: userError } = useFetchUser();
  if(isLoadingUser){
        return <div><LoadingPage/></div>;
  }
  return (
    <div>
      {(!authUser || isLoadingUser) && <HomeDescription />}
      {/* <div className='w-full
      h-screen'>

      </div> */}
      {authUser && <Navigate to={'/app-calculator'} />}
    </div>
  )
}

export default Home