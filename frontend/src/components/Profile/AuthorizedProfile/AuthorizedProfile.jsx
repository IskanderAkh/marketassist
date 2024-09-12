import React, { useState, useEffect } from "react";
import "./AuthorizedProfile.scss";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/useLogout";
import Account from "../../ProfileSubRoutes/Account";
import Plans from "../../ProfileSubRoutes/Plans";
import Subscriptions from "../../ProfileSubRoutes/Subscriptions";

const AuthorizedProfile = ({ authUser }) => {
  const { logout } = useLogout();
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem('activeLink') || "account";
  });

  const changeActiveLink = (linkName) => {
    setActiveLink(linkName);
    localStorage.setItem('activeLink', linkName); 
  };

  useEffect(() => {
    const savedActiveLink = localStorage.getItem('activeLink');
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    }
  }, []);

  return (
    <div className="authorized-profile">
      <div className="text-center">
        <h1>Приветсвуем, {authUser.firstName}!</h1>

        <div className="flex items-center justify-between mt-10">
          <div className="flex gap-4 items-center">
            <button
              className={`btn ${activeLink === "account" ? "btn-primary" : ""}`}
              onClick={() => changeActiveLink("account")}
            >
              Аккаунт
            </button>
            <button
              className={`btn ${activeLink === "plans" ? "btn-primary" : ""}`}
              onClick={() => changeActiveLink("plans")}
            >
              Тарифные планы
            </button>
            <button
              className={`btn ${activeLink === "subscriptions" ? "btn-primary" : ""}`}
              onClick={() => changeActiveLink("subscriptions")}
            >
              Подписки и счета
            </button>
          </div>
          <button className="btn btn-wide btn-error btn-outline" onClick={logout}>
            Выйти из аккаунта <LogOut />
          </button>
        </div>
        <div>
          {(activeLink === "account" && authUser.isVerified) && <Account authUser={authUser} />}
          {(activeLink === "plans" && authUser.isVerified) && <Plans authUser={authUser} />}
          {(activeLink === "subscriptions" && authUser.isVerified) && <Subscriptions authUser={authUser} />}
        </div>
      </div>
    </div>
  );
};

export default AuthorizedProfile;
