import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Проверьте правильность введенных данных");
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
        <div className='flex flex-col   form-container-inputs'>
          <div className='flex items-end justify-between w-full form-container-inputs-div'>
            <input
              type="email"
              placeholder="E-mail"
              name='email'
              className="form-container-inputs-item bg-transparent manrope-medium"
              onChange={handleInputChange}
              value={formData.email} />
          </div>
          <div className='flex items-end justify-between w-full form-container-inputs-div relative'>
            <input
              type={visible ? "text" : "password"}
              name='password'
              placeholder="Пароль"
              className="form-container-inputs-item  bg-transparent cursor-pointer"
              onChange={handleInputChange}
              value={formData.password} />
            <button
              type="button"
              className='w-5 absolute top-0 right-4 bottom-0'
              onClick={e => handleShowPass(e)}>
              {visible ? <img src={eyeOpen} alt="" /> : <img src={eyeClose} alt="" />}
            </button>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-10'>
          <div href="/forgot-password" className="text-center">
            <Link to="/forgot-password" className='manrope-bold forgot-pass'>
              Забыли пароль?
            </Link>
          </div>
          <div className='relative'>
            <button className="w-full text-2xl mt-0 login-btn font-rfBold" >{isPending ? "Входим..." : "Войти"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
