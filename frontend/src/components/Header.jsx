import * as React from "react";
import { Link } from "react-router-dom";
import { User, X } from "lucide-react";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import UnauthHeader from "./Header/UnauthHeader";
import { useFetchUser } from "@/store/useUserStore";

const Header = () => {
  const { data: authUser, isLoading, isError, error } = useFetchUser();
  const [isMenuOpen, setMenuOpen] = useState(false);

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
    <div className="header flex justify-center items-center z-20 bg-white">
      <Container>
        {
          authUser && !isLoading ? <div><div className={`navbar bg-base-100 z-[50] relative navbar-radius`}>
            <div className="navbar-start">
              <Link to="/" className="header-logo ">
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
                <ListItem href="/repricer" title="Репрайсер" isClickable={authUser} isMenuOpen={isMenuOpen}>
                  Репрайсер
                </ListItem>
              </ul>
            </div>

            <div className="navbar-end flex items-center space-x-4 justify-end">
              <div className="indicator w-12">
                <Link to="/auth" className="btn btn-ghost btn-circle">
                  <User />
                </Link>
              </div>
              <button
                className="lg:hidden btn btn-ghost btn-circle "
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-[51]"
                onClick={closeMenu}
                aria-label="Close Menu"
              ></div>
            )}

            <div
              className={`fixed  top-0 left-0 duration-300 h-full w-64 bg-base-100 shadow-lg transform transition-transform  ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
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
            </div></div> : <UnauthHeader />
        }

      </Container>
    </div>
  );
};

const ListItem = ({ className, title, children, isMenuOpen, isClickable, ...props }) => {
  return (
    <Link
      to={props.href}
      className={`no-underline ${isClickable ? "" : "pointer-events-none"}`}
      {...(isClickable ? props : { onClick: (e) => e.preventDefault() })}
    >
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
          {title}
        </div>

      </li>
    </Link>
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
