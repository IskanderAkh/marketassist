import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User, X } from "lucide-react";
import '@/styles/components/header.scss';
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Условие для мобильных устройств (менее 768px)
    };

    handleResize(); // Проверить сразу при загрузке
    window.addEventListener("resize", handleResize); // Слушаем изменение размера окна

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { data: authUser } = useQuery({
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

  const [isMenuOpen, setMenuOpen] = useState(false);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <Container>

        <div className={`navbar bg-base-100 z-[50] relative rounded-md`}>
          <div className="navbar-start">
            <Link to="/" className="header-logo manrope-bold">
              {/* <img src={logo} alt="" /> */}
              MarketAssist
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 z-[100]">
              <ListItem href="/app-calculator" title="Калькулятор прибыли" isClickable={authUser} isMenuOpen={isMenuOpen}>
                Инструмент для расчета прибыли.
              </ListItem>
              <ListItem href="/app-reviews" title="Управление Отзывами" isClickable={authUser} isMenuOpen={isMenuOpen}>
                Генерируйте автоответы на отзывы клиентов с помощью ИИ.
              </ListItem>
              <ListItem href="/warehouses" title="Поиск лимитов" isClickable={authUser} isMenuOpen={isMenuOpen}>
                Ищите лимиты в вашем складе.
              </ListItem>
              <ListItem href="/chat-ai" title="ИИ" isClickable={authUser} isMenuOpen={isMenuOpen}>
                Чат с Искуственным интелектом.
              </ListItem>
            </ul>
          </div>

          <div className="navbar-end flex items-center space-x-4">
            <Link to="/auth" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <User />
              </div>
            </Link>
            <button
              className="lg:hidden btn btn-ghost btn-circle"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Dark overlay when menu is open */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[51]"
            onClick={closeMenu}
            aria-label="Close Menu"
          ></div>
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 duration-300 h-full w-64 bg-base-100 shadow-lg transform transition-transform  ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } z-[52]`}
        >
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Меню</h2>
            <button
              onClick={closeMenu}
              className="btn btn-ghost btn-circle"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="menu p-4">
            <ListItem href="/app-calculator" title="Калькулятор прибыли" isClickable={authUser} isMenuOpen={isMenuOpen}>
              Инструмент для расчета прибыли.
            </ListItem>
            <ListItem href="/app-reviews" title="Управление Отзывами" isClickable={authUser} isMenuOpen={isMenuOpen}>
              Генерируйте автоответы на отзывы клиентов с помощью ИИ.
            </ListItem>
            <ListItem href="/warehouses" title="Поиск лимитов" isClickable={authUser} isMenuOpen={isMenuOpen}>
              Ищите лимиты в вашем складе.
            </ListItem>
            <ListItem href="/chat-ai" title="ИИ" isClickable={authUser} isMenuOpen={isMenuOpen}>
              Чат с Искуственным интелектом.
            </ListItem>
          </ul>
        </div>
      </Container>
    </div>
  );
};

const ListItem = ({ className, title, children, isMenuOpen, isClickable, ...props }) => {
  return (
    <li
      title={!isClickable ? "Что-бы пользоваться данной функциею, пожалуйста, авторизуйтесь" : ""}
      className={`block p-3 leading-none ${isClickable ? "" : "cursor-not-allowed opacity-50"}`}
    >
      {/* <Link
        to={props.href}
        className={`no-underline ${isClickable ? "" : "pointer-events-none"}`}
        {...(isClickable ? props : { onClick: (e) => e.preventDefault() })}
      > */}
      <div className={`text-sm font-medium leading-none ${!isMenuOpen ? 'tooltip tooltip-bottom' : ''} `} data-tip={`${children}`}>
        <Link
          to={props.href}
          className={`no-underline ${isClickable ? "" : "pointer-events-none"}`}
          {...(isClickable ? props : { onClick: (e) => e.preventDefault() })}
        >
          {title}
        </Link>
      </div>

    </li>
  );
};

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default Header;
