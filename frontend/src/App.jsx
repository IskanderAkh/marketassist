import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import Main from './components/Main';

function App() {


  const { data: authUser, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/auth/me')
        const response = res.data
        return response
      } catch (error) {
        console.log(error);
      }
    }
  })

  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <Main authUser={authUser} />
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
