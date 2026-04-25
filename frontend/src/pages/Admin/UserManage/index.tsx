import React from "react";
import { users } from "../../../data/mockData";

const UserManagePage: React.FC = () => {
  return (
    <div className="section">
      <h1>User Manage</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role ID</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}><td>{u.user_id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role_id}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagePage;
