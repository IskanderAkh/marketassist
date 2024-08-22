import React from "react";
import "./UnauthorizedProfile.scss";
import { Link } from "react-router-dom";

const UnauthorizedProfile = () => {
  return (
    <div className="unauthorized-profile">
      <h1>Unauthorized Access</h1>
      <p>Please log in to access your profile.</p>
      <button className="btn">
        <Link to="/auth">Go Login</Link>
      </button>
    </div>
  );
};

export default UnauthorizedProfile;
