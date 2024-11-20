import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { useFetchUser } from "@/store/useUserStore";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import Container from "@/components/ui/Container";
import { useLocation } from "react-router-dom";
const Auth = () => {
  const location = useLocation()
  const currentSubLocation = location.pathname.split('/')[2];
  const navigate = useNavigate();

  const [login, setLogin] = useState(currentSubLocation);
  const { data: authUser, isLoading, isError, error } = useFetchUser();

  if (isLoading) {
    return <div><LoadingPage /></div>;
  }
  const changeRoute = (page) => {
    setLogin(page);
    navigate(`/Auth/${page}`); // Update the URL

  }
  if (authUser) {
    return <Navigate to="/profile/account" />;
  }

  return (
    <>
      <Container>

        {isError && (
          <div className="mb-20 flex items-center justify-center flex-col">
            <div className="mt-20 auth-btns flex gap-5">
              <button
                className={`${login === 'Login' ? 'gradient-color' : ''
                  } font-rfSemibold`}
                onClick={() => changeRoute('Login')}
              >
                Вход
              </button>
              |
              <button
                className={`${login === 'Register' ? 'gradient-color' : ''
                  } font-rfSemibold`}
                onClick={() => changeRoute('Register')}
              >
                Регистрация
              </button>
            </div>
            {login === 'Login' && <Login />}
            {login === 'Register' && <Register />}
          </div>
        )}

      </Container>
    </>
  );
};

export default Auth;
