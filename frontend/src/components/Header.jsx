import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "lucide-react";
import './utilsheader.scss'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
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

  return (
    <div className="relative">
      <div className={`navbar bg-base-100 z-[50] relative rounded-md`}>
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">
            MarketAssist
          </Link>
        </div>
        <div className="navbar-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <li>
                  <Link to="/">Главная</Link>
                </li>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Утилиты
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] z-[100] bg-white">
                    <ListItem
                      href="/product-cost"
                      title="Себестоимость"
                      isClickable={authUser}
                    >
                      Добавьте продукт в список себестоимости.
                    </ListItem>
                    <ListItem
                      href="/app-calculator"
                      title="Калькулятор прибыли"
                      isClickable={authUser}
                    >
                      Инструмент для расчета прибыли.

                    </ListItem>
                    <ListItem
                      href="/app-reviews"
                      title="Управление Отзывами"
                      isClickable={authUser}
                    >
                      Генерируйте автоответы на отзывы клиентов.
                    </ListItem>
                    <ListItem
                      href="/warehouses"
                      title="Поиск лимитов"
                      isClickable={authUser}
                    >
                      Ищите лимиты в вашем складе.
                    </ListItem>
                    <ListItem
                      href="/chat-ai"
                      title="Искуственный интелект"
                      isClickable={authUser}
                    >

                      Чат с Искуственным интелектом.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <li>
                  <Link to="/contact">Контакты</Link>
                </li>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1 z-[100]"></ul>
          <div className="">
            <Link to="/auth" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <User />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef(
  ({ className, title, children, isClickable, ...props }, ref) => {
    return (
      <li title={ !isClickable ? "Что-бы пользоваться данной функциею, пожалуйста, авторизуйтесь" : ""}>
        <NavigationMenuLink asChild>
          <Link
            to={props.href}
            // ref={ref}
            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className} ${isClickable ? "" : "cursor-not-allowed opacity-50"
              }`}
            {...(isClickable ? props : { onClick: (e) => e.preventDefault() })}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="text-sm leading-tight text-muted-foreground" >
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

export default Header;
