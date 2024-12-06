import React, { useState, useEffect } from "react";
import "./AuthorizedProfile.scss";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/useLogout";
import Account from "../../ProfileSubRoutes/Account";
import Plans from "../../ProfileSubRoutes/Plans";
import Subscriptions from "../../ProfileSubRoutes/Subscriptions";
import axios from 'axios';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ApiKeys from "@/components/ProfileSubRoutes/ApiKeys";
import { useFetchUser } from "@/store/useUserStore";
import { useLocation, useNavigate } from "react-router-dom";

const AuthorizedProfile = () => {
  const { data: authUser, isLoading: isLoadingUser, isError: isUserError, error: userError } = useFetchUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const [activeLink, setActiveLink] = useState(() => {
    return location.pathname.split('/')[2] || "account";
  });

  const queryClient = useQueryClient();

  const changeActiveLink = (linkName) => {
    setActiveLink(linkName);
    localStorage.setItem('activeLink', linkName);
    navigate(`/profile/${linkName}`); // Update the URL
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
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: () => {
      toast.error("Не удалось скрыть ошибку");
    }
  });

  // Sync activeLink with location.pathname when the URL changes
  useEffect(() => {
    const subLocation = location.pathname.split('/')[2] || "account";
    setActiveLink(subLocation);
  }, [location]);

  // Load saved active link from localStorage
  useEffect(() => {
    const savedActiveLink = localStorage.getItem('activeLink');
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    }
  }, []);

  return (
    <div className="authorized-profile">
      <div className="text-center">
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
              className={`font-rfBold ${activeLink === "account" ? "bg-custom-gradient active-route text-white" : "unactive-route"}`}
              onClick={() => changeActiveLink("account")}
            >
              Аккаунт
            </button>
            <button
              className={`font-rfBold ${activeLink === "plans" ? "bg-custom-gradient active-route text-white" : "unactive-route"}`}
              onClick={() => changeActiveLink("plans")}
            >
              Тарифные планы
            </button>
            <button
              className={`font-rfBold ${activeLink === "subscriptions" ? "bg-custom-gradient active-route text-white" : "unactive-route"}`}
              onClick={() => changeActiveLink("subscriptions")}
            >
              Подписки и счета
            </button>
            <button
              className={`font-rfBold ${activeLink === "apikeys" ? "bg-custom-gradient active-route text-white" : "unactive-route"}`}
              onClick={() => changeActiveLink("apikeys")}
            >
              API ключи
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
          {(activeLink === "apikeys" && authUser.isVerified) && <ApiKeys authUser={authUser} />}
        </div>
      </div>
    </div>
  );
};

export default AuthorizedProfile;
