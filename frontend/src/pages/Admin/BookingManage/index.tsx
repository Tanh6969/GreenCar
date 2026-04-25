import React from "react";
import { bookingService } from "../../../services/booking.service";
import { formatDateTime } from "../../../utils/date";

const BookingManagePage: React.FC = () => {
  const [data, setData] = React.useState<any[]>([]);
  React.useEffect(() => {
    bookingService.getAllBookings().then(setData);
  }, []);

  return (
    <div className="section">
      <h1>Booking Manage</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Status</th><th>Start</th><th>End</th><th>Actual KM</th></tr></thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.booking_id}>
                <td>{b.booking_id}</td>
                <td>{b.status}</td>
                <td>{formatDateTime(b.start_time)}</td>
                <td>{formatDateTime(b.end_time)}</td>
                <td>{b.actual_km}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagePage;
