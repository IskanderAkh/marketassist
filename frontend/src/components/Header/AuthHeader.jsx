import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User, X } from "lucide-react";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import logo from "@/assets/images/logo.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const AuthHeader = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
  }, [isMenuOpen]);

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
  const setProfileSate = (page) => {
    localStorage.setItem("activeLink", page);
  }
  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

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

            <div className="navbar-end flex items-center justify-end">
              <NavigationMenu className="">
                <NavigationMenuList className="">
                  <NavigationMenuItem className="">
                    <NavigationMenuTrigger className="poppins-medium custom-trigger px-10 font-rfSemibold">Утилиты</NavigationMenuTrigger>
                    <NavigationMenuContent className=" left-auto">
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <ListItem href="/product-cost" title="Себестоимость" isClickable={authUser} className="">
                          Добавьте продукт в список себестоимости.
                        </ListItem>
                        <ListItem href="/app-calculator" title="Калькулятор прибыли" isClickable={authUser}>
                          Инструмент для расчета прибыли.
                        </ListItem>
                        <ListItem href="/app-reviews" title="Управление Отзывами" isClickable={authUser}>
                          Генерируйте автоответы на отзывы клиентов.
                        </ListItem>
                        <ListItem href="/warehouses" title="Поиск лимитов" isClickable={authUser}>
                          Ищите лимиты в вашем складе.
                        </ListItem>
                        <ListItem href="/chat-ai" title="Искуственный интелект" isClickable={authUser}>
                          Чат с Искуственным интелектом.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="">
                    <NavigationMenuTrigger className="poppins-medium custom-trigger">
                      <button className="w-full flex items-center justify-center px-10">
                        <User className="font-rfSemibold" />
                      </button>

                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-auto " >
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <ListItem href="/profile/account" title="Аккаунт" isClickable={authUser} onClick={() => setProfileSate("account")}>
                          Аккаунт.
                        </ListItem>
                        <ListItem href="/profile/plans" title="Тарифные планы" isClickable={authUser} onClick={() => setProfileSate("plans")}>
                          Тарифные планы.
                        </ListItem>
                        <ListItem href="/profile/subscriptions" title="Подписки и счета" isClickable={authUser} onClick={() => setProfileSate("subscriptions")}>
                          Подписки и счета.
                        </ListItem>
                        <ListItem href={`/questions`} title="Вопросы" isClickable={authUser} className="">
                          Вопросы.
                        </ListItem>
                        <ListItem href="/contact" title="Контакты" isClickable={authUser} >
                          Контакты.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
                {/* <NavigationMenuList>

                </NavigationMenuList> */}
              </NavigationMenu>


              <button
                className="lg:hidden btn btn-ghost btn-circle"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-[51]" onClick={closeMenu} aria-label="Close Menu"></div>
          )}
        </div>
      </Container>
    </div>
  );
};

const ListItem = React.forwardRef(({ className, title, children, isClickable, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href}
          title={!isClickable ? "Что-бы пользоваться данной функциею, пожалуйста, авторизуйтесь" : ""}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors 
            hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground 
            ${className} ${isClickable ? "" : "cursor-not-allowed opacity-50"}`}
          {...(isClickable ? props : { onClick: (e) => e.preventDefault() })}
        >
          <div className="text-sm font-medium leading-none ">{title}</div>
          <p className="text-sm leading-tight text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

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