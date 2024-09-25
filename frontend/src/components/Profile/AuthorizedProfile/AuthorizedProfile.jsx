import React, { useState, useEffect } from "react";
import "./AuthorizedProfile.scss";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/useLogout";
import Account from "../../ProfileSubRoutes/Account";
import Plans from "../../ProfileSubRoutes/Plans";
import Subscriptions from "../../ProfileSubRoutes/Subscriptions";
import axios from 'axios'; // Make sure axios is imported
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AuthorizedProfile = ({ authUser }) => {
  const { logout } = useLogout();
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem('activeLink') || "account";
  });
  const queryClient = useQueryClient();
  const changeActiveLink = (linkName) => {
    setActiveLink(linkName);
    localStorage.setItem('activeLink', linkName);
  };
  const { mutate: handleErrorVisibilityToggle } = useMutation({
    mutationFn: async (errorId) => {
      try {
        await axios.put(`/api/user/${authUser._id}/errors/${errorId}`, { visible: false });

      } catch (error) {
        console.error("Error updating visibility:", error);
      }
    },
    onSuccess: () => {
      toast.success("Ошибка скрыта");
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: () => {
      toast.error("Не удалось скрыть ошибку");
    }
  })


  useEffect(() => {
    const savedActiveLink = localStorage.getItem('activeLink');
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    }
  }, []);

  return (
    <div className="authorized-profile">
      <div className="text-center">
        <h1>Приветствуем, {authUser.firstName}!</h1>
        {authUser.userErrors && authUser.userErrors.map((error) => (
          error.visible && (
            <div key={error._id} className="alert alert-warning flex justify-between">
              <span>{error.message}</span>
              <button
                className="btn btn-sm btn-circle btn-error"
                onClick={() => handleErrorVisibilityToggle(error._id)}
              >
                ✖
              </button>
            </div>
          )
        ))}
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
