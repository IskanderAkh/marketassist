import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { useFetchUser } from "@/store/useUserStore";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import Container from "@/components/ui/Container";

const Auth = () => {
  const [login, setLogin] = useState(true);
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
      <Container>

        {isError && (
          <div className="mb-20 flex items-center justify-center flex-col">
            <div className="mt-20 auth-btns flex gap-5">
              <button
                className={`${login ? 'gradient-color ' : ''}font-rfSemibold`}
                onClick={() => setLogin(true)}
              >
                Вход
              </button>
              |
              <button
                className={`${!login ? 'gradient-color  ' : ''} font-rfSemibold`}
                onClick={() => setLogin(false)}
              >
                Регистрация
              </button>
              {/* <div className={`whitespace ${login ? "left" : "right"}`}>
                <div className="whitespace-nowrap"></div>
              </div> */}
            </div>
            {login ? <Login /> : <Register />}
          </div>
        )}
      </Container>
    </>
  );
};

export default Auth;
