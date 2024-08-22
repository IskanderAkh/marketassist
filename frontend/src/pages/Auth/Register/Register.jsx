import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import CountrySelect from "./CountrySelect";
import "./register.scss";
import toast from "react-hot-toast";

const Register = () => {
  const location = useLocation();
  const [next, setNext] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    innOrOgrnip: "",
    companyName: "",
    phoneNumber: "",
  });

  const { mutate: loginMutation, isPending, isError } = useMutation({
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
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message || "Something went wrong");
      }
    },
    onSuccess: () => {
      toast.success("Registration successful");
      location.pathname = "/";
    },
  });

  const goNext = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmpassword
    ) {
      toast.error("You need to fill all the blanks");
    } else if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords do not match");
    } else {
      setNext(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryChange = (country) => {
    setFormData((prevData) => ({
      ...prevData,
      country,
    }));
  };

  const validateInnOrOgrnip = (value) => {
    if (value.length === 10 || value.length === 15) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInnOrOgrnip(formData.innOrOgrnip)) {
      toast.error("ИНН должен быть 10 символов, а ОГРНИП 15 символов");
      return;
    }

    try {
      loginMutation(formData);
      location.pathname = "/";
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="overflow-hidden flex">
        {!next && (
          <div className={`flex flex-col gap-4 mt-10 registration-1 w-full`}>
            <div className="flex">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
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
                placeholder="Last Name"
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
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-container-input bg-transparent"
                required
              />
            </div>
            <span className="border-b border-gray-300"></span>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-container-input bg-transparent"
                minLength={6}
                required
              />
            </div>
            <span className="border-b border-gray-300"></span>
            <div>
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="form-container-input bg-transparent"
                minLength={6}
                required
              />
            </div>
            <span className="border-b border-gray-300"></span>
            {!next && (
              <button
                className="submit-button bg-black text-white w-full py-4 mt-16"
                type="button"
                onClick={goNext}
              >
                {isPending ? "Loading..." : "Next"}
              </button>
            )}
          </div>
        )}

        {next && (
          <div className={`flex flex-col gap-4 mt-10 registration-2 w-full`}>
            <div>
              <CountrySelect onCountryChange={handleCountryChange} />
            </div>
            <span className="border-b border-gray-300"></span>
            <div>
              <input
                type="number"
                name="innOrOgrnip"
                placeholder="Введите ИНН/ОГРНИП"
                value={formData.innOrOgrnip}
                onChange={handleChange}
                className="form-container-input bg-transparent"
                required
              />
            </div>
            <span className="border-b border-gray-300"></span>
            <div>
              <input
                type="number"
                name="phoneNumber"
                placeholder="Номер телефона"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={15}
                className="form-container-input bg-transparent"
                required
              />
            </div>
            <span className="border-b border-gray-300"></span>
            <div>
              <input
                type="text"
                name="companyName"
                placeholder="Название компании"
                value={formData.companyName}
                onChange={handleChange}
                className="form-container-input bg-transparent"
                required
              />
            </div>
            <span className="border-b border-gray-300"></span>
            <button
              className="submit-button border-primary border w-full py-4 bg-inherit"
              type="button"
              onClick={() => setNext(!next)}
            >
              {isPending ? "Loading..." : "Go Back"}
            </button>
            <button
              className="submit-button bg-black text-white w-full py-4 mt-16"
              type="submit"
            >
              {isPending ? "Loading..." : "Register"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
