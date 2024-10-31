import React, { useState } from "react";
import "./auth.scss";
import { Link, Navigate, useLocation } from "react-router-dom";
import Login from "./Login/Login";
import { useQuery } from "@tanstack/react-query";
import Register from "./Register/Register";
import { useFetchUser } from "@/store/useUserStore";
import LoadingPage from "@/components/LoadingPage/LoadingPage";

const Auth = () => {
  const [login, setLogin] = useState(true);
  const location = useLocation();
  const { data: authUser, isLoading, isError, error } = useFetchUser();


  if (isLoading) {
    return <div><LoadingPage /></div>;
  }

  if (authUser) {
    // User is authenticated, redirect to another page
    return <Navigate to="/profile" replace />;
  }

  return (
    <>
      {isError && (
        <div className="mb-20">
          <div className="auth-choice mx-auto mt-14 flex h-16 max-w-lg p-1">
            <button
              className={`auth-choice-btn flex-1`}
              onClick={() => setLogin(true)}
            >
              Вход
            </button>
            <button
              className={`auth-choice-btn flex-1`}
              onClick={() => setLogin(false)}
            >
              Регистрация
            </button>
            <div className={`whitespace ${login ? "left" : "right"}`}>
              <div className="whitespace-nowrap"></div>
            </div>
          </div>
          {login ? <Login /> : <Register />}
        </div>
      )}
    </>
  );
};

export default Auth;
