import React from "react";
import { bookings, users, vehicles } from "../../../data/mockData";

const DashboardPage: React.FC = () => {
  return (
    <div className="section">
      <h1>Dashboard</h1>
      <div className="cards-3">
        <article className="panel"><h3>Nguoi dung</h3><p>{users.length}</p></article>
        <article className="panel"><h3>Xe</h3><p>{vehicles.length}</p></article>
        <article className="panel"><h3>Bookings</h3><p>{bookings.length}</p></article>
      </div>
    </div>
  );
};

export default DashboardPage;
