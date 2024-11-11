import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import eyeOpen from "../../../assets/eyeOpen.svg"
import eyeClose from "../../../assets/eyeClose.svg"
const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending, isError, error, } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Что-то пошло не так");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Вы вошли в систему");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // fetchUser()
      setIsSignIn(true);
      setTimeout(() => {
        formData.email = "";
        formData.password = "";
      }, 500);
      return <Navigate to="/" replace />;
    },
    onError: () => {
      toast.error("Проверьте правильность введенных данных")
    }
  });
  const handleShowPass = (e) => {
    e.preventDefault()
    setVisible(!visible)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);

  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <form className='flex gap-4 form-container-form' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 mb-8  form-container-inputs'>
          <div className='flex items-end justify-between w-full'>
            <input
              type="email"
              placeholder="E-mail"
              name='email'
              className="form-container-inputs-item bg-transparent"
              onChange={handleInputChange}
              value={formData.email} />
          </div>
          <div className='flex items-end justify-between w-full'>
            <input
              type={visible ? "text" : "password"}
              name='password'
              placeholder="Пароль"
              className="form-container-inputs-item  bg-transparent"
              onChange={handleInputChange}
              value={formData.password} />
            <button
              type="button"
              className='w-5'
              onClick={e => handleShowPass(e)}>
              {visible ? <img src={eyeOpen} alt="" /> : <img src={eyeClose} alt="" />}
            </button>
          </div>
        </div>
        <div>
          <div href="/forgot-password" className="forgot-password text-center">
            <Link to="/forgot-password">
              Забыли свой пароль?
            </Link>
          </div>
          <button className="w-full py-4 mt-16 try-btn " >{isPending ? "Входим..." : "Войти"}</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
