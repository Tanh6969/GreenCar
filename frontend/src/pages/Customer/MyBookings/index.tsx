import React from "react";
import { bookingService } from "../../../services/booking.service";
import { useAuth } from "../../../hooks/useAuth";
import { formatCurrency } from "../../../utils/formatters";

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    bookingService.getBookingsByUser(user.user_id).then(setData);
  }, [user]);

  return (
    <div className="section">
      <h1>My Bookings</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.booking_id}><td>{b.booking_id}</td><td>{b.status}</td><td>{formatCurrency(b.total_price)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookingsPage;
