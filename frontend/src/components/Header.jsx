import { Link } from "react-router-dom";
import { User } from "lucide-react";

import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Header = () => {
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
          <div className="flex gap-4">
            <Link to="/">Главная</Link>
            <Link to={authUser ? "/app-analytics" : "/analytics"}>Аналитика</Link>
            <Link to={authUser ? "/app-reviews" : "/reviews"}>Отзывы</Link>
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
