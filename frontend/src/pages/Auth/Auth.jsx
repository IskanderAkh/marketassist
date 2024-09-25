import React, { useState } from "react";
import "./auth.scss";
import { Link, Navigate, useLocation } from "react-router-dom";
import Login from "./Login/Login";
import { useQuery } from "@tanstack/react-query";
import Register from "./Register/Register";

const Auth = () => {
  const [login, setLogin] = useState(true);
  const location = useLocation();

  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <div></div>;
  }

  if (authUser) {
    // User is authenticated, redirect to another page
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {isError && (
        <div>
          <h1 className="title text-center text-2xl mt-10">Войдите в аккаунт что-бы пользоваться функциями сайта</h1>
          <h1 className="title text-center text-3xl mt-10">Вход</h1>
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
