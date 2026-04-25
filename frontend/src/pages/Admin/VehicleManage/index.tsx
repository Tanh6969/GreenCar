import React from "react";
import { vehicleService } from "../../../services/vehicle.service";

const VehicleManagePage: React.FC = () => {
  const [data, setData] = React.useState<any[]>([]);
  React.useEffect(() => {
    vehicleService.getVehicleCards().then(setData);
  }, []);

  return (
    <div className="section">
      <h1>Vehicle Manage</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Model</th><th>Status</th><th>Location</th></tr></thead>
          <tbody>
            {data.map((v) => (
              <tr key={v.vehicle.vehicle_id}>
                <td>{v.vehicle.vehicle_id}</td>
                <td>{`${v.model.brand} ${v.model.name}`}</td>
                <td>{v.vehicle.status}</td>
                <td>{v.location.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleManagePage;
