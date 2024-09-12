import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
      <form onSubmit={handleSubmit} className="overflow-hidden flex flex-col gap-4 mt-10 w-full">
        <div className="flex">
          <input
            type="text"
            name="firstName"
            placeholder="Имя"
            value={formData.firstName}
            className="form-container-input bg-transparent"
            onChange={handleChange}
            required
          />
        </div>
        <span className="border-b border-gray-300"></span>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Фамилия"
            value={formData.lastName}
            className="form-container-input bg-transparent"
            onChange={handleChange}
            required
          />
        </div>
        <span className="border-b border-gray-300"></span>
        <div>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="form-container-input bg-transparent"
            required
          />
        </div>
        <span className="border-b border-gray-300"></span>
        <div className="flex">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            title="Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы"
            className="form-container-input bg-transparent"
            minLength={6}
            required

          />
          <button onClick={handleShowPass} className="border-none outline-none"><img className="w-6 h-6" src={showPass ? './eyeClose.svg' : './eyeOpen.svg'} title={showPass ? "Скрыть пароль" : "Показать пароль"} alt="" /></button>
        </div>
        <span className="border-b border-gray-300"></span>
        <div className="flex pr-4">
          <input
            type={showPass ? "text" : "password"}
            name="confirmpassword"
            placeholder="Подтвеждение пароля"
            value={formData.confirmpassword}
            onChange={handleChange}
            className="form-container-input bg-transparent"
            minLength={6}
            required
            title="Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы"

          />
          {
            (formData.confirmpassword == formData.password && formData.password.length >= 6 && formData.confirmpassword.length >= 6) && <div>
              <span className="" ><FcCheckmark />
              </span>
            </div>
          }
          {
            (formData.confirmpassword !== formData.password) &&
            <div title="Пароли не совпадают"><FcCancel /></div>
          }
        </div>

        <span className="border-b border-gray-300"></span>
        <div>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Номер телефона"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength={12}
            className="form-container-input bg-transparent"
            required
          />

        </div>
        <span className="border-b border-gray-300"></span>
        <button
          className="submit-button bg-black text-white w-full py-4 mt-16"
          type="submit"
        >
          {isPending ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default Register;
