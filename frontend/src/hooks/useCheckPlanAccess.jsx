import { useState, useEffect } from 'react';
import axios from 'axios';

const useCheckPlanAccess = (requiredPlans) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/user/checkPlanAccess', { requiredPlans });
        setHasAccess(response.data.hasAccess);
      } catch (err) {
        setError('Ошибка проверки доступа к плану');
        console.error('Error in useCheckPlanAccess:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [requiredPlans]);

  return { hasAccess, loading, error };
};

export default useCheckPlanAccess;
