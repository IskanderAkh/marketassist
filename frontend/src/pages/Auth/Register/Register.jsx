import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./register.scss";
import toast from "react-hot-toast";
import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import axios from "axios";

const Register = () => {
  const queryClient = useQueryClient();
  const [showPass, setShowPass] = useState(false);
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    companyName: "",
    phoneNumber: "",
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Что-то пошло не так");
        }
      } catch (error) {
        throw new Error(error.message || "Что-то пошло не так");
      }
    },
    onSuccess: () => {
      toast.success("Регистрация прошла успешно");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      return <Navigate to="/profile" replace />;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowPass = (e) => {
    e.preventDefault()
    setShowPass(!showPass);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmpassword) {
      toast.error("Вам нужно заполнить все пробелы");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    try {
      loginMutation(formData);
      location.pathname = "/";
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className=" flex gap-4 mt-10 w-full form-container-form">
        <div className="form-container-inputs">

          <div className="flex form-container-inputs-div">
            <input
              type="text"
              name="firstName"
              placeholder="Имя"
              value={formData.firstName}
              className="form-container-inputs-item bg-transparent manrope-medium"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-container-inputs-div">
            <input
              type="text"
              name="lastName"
              placeholder="Фамилия"
              value={formData.lastName}
              className="form-container-inputs-item bg-transparent manrope-medium"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-container-inputs-div">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="form-container-inputs-item bg-transparent manrope-medium"
              required
            />
          </div>
          <div className="flex form-container-inputs-div relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              title="Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы"
              className="form-container-inputs-item bg-transparent manrope-medium"
              minLength={6}
              required

            />
            <button
              type="button"
              onClick={handleShowPass}
              className="border-none outline-none absolute top-0 right-4 bottom-0">
              <img
                className="w-6 h-6"
                src={showPass ? './eyeClose.svg' : './eyeOpen.svg'}
                title={showPass ? "Скрыть пароль" : "Показать пароль"}
                alt=""
              />
            </button>
          </div>
          <div className="flex form-container-inputs-div relative ">
            <input
              type={showPass ? "text" : "password"}
              name="confirmpassword"
              placeholder="Подтвеждение пароля"
              value={formData.confirmpassword}
              onChange={handleChange}
              className="form-container-inputs-item bg-transparent manrope-medium"
              minLength={6}
              required
              title="Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы"

            />
            {
              (formData.confirmpassword == formData.password && formData.password.length >= 6 && formData.confirmpassword.length >= 6) && <div>
                <span className="absolute top-0 right-4 bottom-0 flex items-center justify-center" ><FcCheckmark />
                </span>
              </div>
            }
            {
              (formData.confirmpassword !== formData.password) &&
              <div title="Пароли не совпадают" className="absolute top-0 right-4 bottom-0 flex items-center justify-center"><FcCancel /></div>
            }
          </div>


          <div className="form-container-inputs-div">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Номер телефона"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength={12}
              className="form-container-inputs-item bg-transparent manrope-medium"
              required
            />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-10'>
          <div href="/forgot-password" className="text-center">
            <Link to="/forgot-password" className='manrope-bold forgot-pass'>
              Забыли пароль?
            </Link>
          </div>
          <div className='relative'>
            <button className="text-2xl mt-0 login-btn font-rfBold register-btn" >{isPending ? "Регистрируем..." : "Зарегистрироваться"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
