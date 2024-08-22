import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsSignIn(true);
      location.pathname('/')
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
    setTimeout(() => {
      formData.email = "";
      formData.password = "";
    }, 500);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 mb-8 mt-32'>
          <input
            type="email"
            placeholder="Email"
            name='email'
            className="form-container-input bg-transparent"
            onChange={handleInputChange}
            value={formData.email} />
          <span className='border-b border-gray-300 '></span>
          <input
            type="password"
            name='password'
            placeholder="Password"
            className="form-container-input mt-10 bg-transparent"
            onChange={handleInputChange}
            value={formData.password} />
          <span className='border-b border-gray-300'></span>
        </div>
        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
        </div>
        <button className="submit-button bg-black text-white w-full py-4 mt-16">{isPending ? "Loading..." : "Sign in"}</button>
        <div href="/forgot-password" className="forgot-password text-center">
          <Link to="/forgot-password">
            Have you forgotten your password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
