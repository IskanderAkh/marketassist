import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full py-4 backdrop-blur bg-white">
      <Container>
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold transition-opacity hover:opacity-70"
            title="Home Page"
          >
            Logo
          </Link>

          <div className="flex gap-14 header-links">
            <Link to="/" className={`${location.pathname === "/" ? "active" : ""}`}>Главная</Link>
            <Link to={authUser ? `/product-cost` : '/auth'} className={`${location.pathname === "/product-cost" ? "active" : ""}`}>Себестоимость</Link>
            <Link to={authUser ? "/app-calculator" : "/auth"} className={`${location.pathname === "/app-calculator" || location.pathname === "/calculator" ? "active" : ""}`}>Калькулятор прибыли</Link>
            <Link to={authUser ? "/app-reviews" : "/auth"} className={`${location.pathname === "/app-reviews" || location.pathname === "/reviews" ? "active" : ""}`}>Управление Отзывами</Link>
            <Link to="/warehouses" className={`${location.pathname === "/warehouses" ? "active" : ""}`}>Приёмка</Link>
            <Link to="/contact" className={`${location.pathname === "/contact" ? "active" : ""}`}>Контакты</Link>
          </div>

          <Link to="/profile">
            <User />
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default Header;
