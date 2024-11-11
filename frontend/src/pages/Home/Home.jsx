import React from 'react'
import HomeDescription from '../../components/Home/HomeDescription'
import { useFetchUser, useUserStore } from '@/store/useUserStore'
import HomeAuthenticated from '@/components/Home/HomeAuthenticated';

const Home = () => {
  const { data: authUser, isLoading: isLoadingUser, isError: isUserError, error: userError } = useFetchUser();
  return (
    <div>
      {(!authUser || isLoadingUser) && <HomeDescription />}
      {/* <div className='w-full
      h-screen'>

      </div> */}
      {authUser && <HomeAuthenticated />}
    </div>
  )
}

export default Home