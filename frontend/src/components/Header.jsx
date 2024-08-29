import { Link } from "react-router-dom";
import { User } from "lucide-react";

import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation()
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const response = res.data;
        console.log(response);
        return response;
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
            <Link to={authUser ? "/app-analytics" : "/analytics"} className={`${location.pathname === "/app-analytics" || location.pathname === "/analytics" ? "active" : ""}`}>Калькулятор прибыли</Link>
            <Link to={authUser ? "/app-reviews" : "/reviews"} className={`${location.pathname === "/app-reviews" || location.pathname === "/reviews" ? "active" : ""}`}>Отзывы</Link>
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
