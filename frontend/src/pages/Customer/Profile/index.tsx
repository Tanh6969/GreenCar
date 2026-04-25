import React from "react";
import { useAuth } from "../../../hooks/useAuth";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="section">
      <h1>Profile</h1>
      <article className="panel">
        <p>{`Ho ten: ${user?.name ?? "-"}`}</p>
        <p>{`Email: ${user?.email ?? "-"}`}</p>
        <p>{`So dien thoai: ${user?.phone ?? "-"}`}</p>
      </article>
    </div>
  );
};

export default ProfilePage;
