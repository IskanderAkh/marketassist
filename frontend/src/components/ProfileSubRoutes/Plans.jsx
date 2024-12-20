import React from 'react';
import useGetAllPlans from '../../hooks/useGetAllPlans';
import Plan from '../Plan/Plan';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Skeleton = () => (
  <div className="skeleton h-80 w-96 bg-gray-200"></div>

);

const Plans = () => {
  const { plans } = useGetAllPlans();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
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
<<<<<<< HEAD
    <div className="mx-auto mt-10">
=======
    <div className="mt-10 mx-auto">
>>>>>>> 3e2c4e58720f922eeeb186a5d1e90828f6dc59fc
      <div className='flex flex-wrap gap-20'>
        {isLoadingUserPlan ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} />)
        ) : (
          plans?.map((plan, i) => {
            return (
              <Plan
                plan={plan}
                key={plan._id}
                userPlan={userPlan}
                authUser={authUser}
                planIndex={i}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Plans;
