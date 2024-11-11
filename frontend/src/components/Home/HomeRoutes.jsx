import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Container from "@/components/ui/Container";
import { useFetchUser } from '@/store/useUserStore';
const HomeRoutes = () => {
  const { data: authUser, isLoading: isLoadingUser, isError: isUserError, error: userError } = useFetchUser();

  if (isLoadingUser) return <div>Loading...</div>;

  return (
    <Container>
      <div className="mb-4">Home</div>
      <nav className="space-x-4 mb-8">
        <Link to="app-calculator" className="button">Калькулятор прибыли</Link>
        <Link to="app-reviews" className="button">Управление Отзывами</Link>
        <Link to="warehouses" className="button">Поиск лимитов</Link>
        <Link to="chat-ai" className="button">ИИ</Link>
        <Link to="repricer" className="button">Репрайсер</Link>
      </nav>

      {/* Outlet renders the active sub-route component here */}
      <Outlet />
    </Container>
  );
}


const ProfitCalculator = () => <div>Калькулятор прибыли: Инструмент для расчета прибыли.</div>;
const ReviewManagement = () => <div>Управление Отзывами: Генерируйте автоответы на отзывы клиентов с помощью ИИ.</div>;
const WarehouseSearch = () => <div>Поиск лимитов: Ищите лимиты в вашем складе.</div>;
const ChatAI = () => <div>ИИ: Чат с Искуственным интелектом.</div>;
const Repricer = () => <div>Репрайсер: Репрайсер для цен.</div>;

// Root component with routing
const App = () => (
  <Routes>
    <Route path="/" element={<HomeRoutes />}>
      {/* Define sub-routes within HomeAuthenticated */}
      <Route path="app-calculator" element={<ProfitCalculator />} />
      <Route path="app-reviews" element={<ReviewManagement />} />
      <Route path="warehouses" element={<WarehouseSearch />} />
      <Route path="chat-ai" element={<ChatAI />} />
      <Route path="repricer" element={<Repricer />} />
    </Route>
  </Routes>
);

export default App;