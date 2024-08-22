import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Header from './components/header';
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
        console.log(response);

        return res.data
      } catch (error) {
        console.log(error);
      }
    }
  })
  return (
    <div className=''>
      {/* <Navbar/> */}
      <Header />
      <Main />
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
