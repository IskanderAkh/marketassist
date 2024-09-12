import React from 'react';
import UsersPlan from '../Plan/UsersPlan';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Skeleton = () => (
  <div className="skeleton h-52 w-2/6 bg-gray-300"></div> 
);

const Subscriptions = () => {
  const { data: userPlan, isLoading: isLoadingUserPlan } = useQuery({
    queryKey: ['userPlan'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/user/plan');
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex mt-10">
      {isLoadingUserPlan ? (
        <Skeleton /> 
      ) : (
        <UsersPlan userPlan={userPlan} />
      )}
    </div>
  );
};

export default Subscriptions;
