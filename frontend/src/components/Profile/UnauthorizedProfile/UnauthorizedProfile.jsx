import React from "react";
import "./UnauthorizedProfile.scss";
import { Link } from "react-router-dom";

const UnauthorizedProfile = () => {
  return (
    <div className="unauthorized-profile">
      <h1>Несанкционированный доступ</h1>
      <p>Пожалуйста, войдите в систему, чтобы получить доступ к вашему профилю.</p>
      <Link to="/auth">
        <button className="btn">
          Войти в систему
        </button>
      </Link>
    </div>
  );
};

export default UnauthorizedProfile;
