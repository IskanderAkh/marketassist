import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User, X } from "lucide-react";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import logo from "@/assets/images/logo.svg"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar";

const AuthHeader = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

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

        <div>
          <div className={`navbar bg-base-100 z-[50] relative navbar-radius`}>
            <div className="navbar-start">
              <Link to="/" className="header-logo manrope-bold">
                <img src={logo} alt="" />
              </Link>
            </div>

            <div className="navbar-end flex items-center space-x-4 justify-end">
              <Menubar className="border-none ">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer utilities">Утилиты</MenubarTrigger>
                  <MenubarContent className="bg-white gap-2 flex flex-col">
                    <Link to="/app-calculator" title="Инструмент для расчета прибыли" isClickable={authUser} isMenuOpen={isMenuOpen} className="w-full h-full cursor-pointer">
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Калькулятор прибыли
                      </MenubarItem>
                    </Link>

                    <Link to="/app-reviews" title="Генерируйте автоответы на отзывы клиентов с помощью ИИ." isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Управление Отзывами
                      </MenubarItem>
                    </Link>

                    <Link to="/warehouses" title="Ищите лимиты в вашем складе." isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-300">
                        Поиск лимитов
                      </MenubarItem>
                    </Link>

                    <Link to="/chat-ai" title="Чат с Искуственным интелектом." isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        ИИ
                      </MenubarItem>
                    </Link>

                    <Link to="/repricer" title="Репрайсер" isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Репрайсер
                      </MenubarItem>
                    </Link>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer"> <div className="indicator w-12">
                    <button to="/auth" className="btn btn-ghost btn-circle">
                      <User />
                    </button>
                  </div></MenubarTrigger>
                  <MenubarContent className="bg-white gap-2 flex flex-col">
                  
                    <Link to="/profile" title="Вопросы" isClickable={authUser} isMenuOpen={isMenuOpen} className="w-full h-full cursor-pointer">
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Вопросы
                      </MenubarItem>
                    </Link>

                    <Link to="/profile" title="Контакты" isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Контакты
                      </MenubarItem>
                    </Link>

                    <Link to="/profile" title="Тарифные планы" isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Тарифные планы
                      </MenubarItem>
                    </Link>

                    <Link to="/profile" title="Подписки и счета" isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Подписки и счета
                      </MenubarItem>
                    </Link>

                    <Link to="/profile" title="Аккаунт" isClickable={authUser} isMenuOpen={isMenuOpen}>
                      <MenubarItem className="cursor-pointer hover:bg-slate-200">
                        Аккаунт
                      </MenubarItem>
                    </Link>

                  </MenubarContent>
                </MenubarMenu>
              </Menubar>


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
          </div>
        </div>
      </Container>
    </div>
  );
};

const ListItem = ({ className, title, children, isMenuOpen, isClickable, ...props }) => {
  return (
    <li
      // title={!isClickable ? "Что-бы пользоваться данной функциею, пожалуйста, авторизуйтесь" : ""}
      className={`block p-3 leading-none ${isClickable ? "" : "cursor-not-allowed opacity-50"}`}
    >
      {/* <Link
        to={props.href}
        className={`no-underline ${isClickable ? "" : "pointer-events-none"}`}
        {...(isClickable ? props : { onClick: (e) => e.preventDefault() })}
      > */}
      <div className={`text-sm font-medium leading-none ${!isMenuOpen ? 'tooltip tooltip-bottom' : ''} `}>
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

export default AuthHeader;
