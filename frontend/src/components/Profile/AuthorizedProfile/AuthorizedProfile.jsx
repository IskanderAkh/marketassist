import React from "react";
import "./AuthorizedProfile.scss";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/useLogout";

const AuthorizedProfile = ({ firstName }) => {
  const { logout } = useLogout();

  return (
    <div className="authorized-profile">
      <h1>Приветсвуем, {firstName}!</h1>
      <p>You have access to all profile features.</p>
      <button className="btn btn-wide" onClick={logout}>
        Выйти из аккаунта <LogOut />
      </button>
    </div>
  );
};

export default AuthorizedProfile;
