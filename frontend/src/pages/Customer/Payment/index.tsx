import React from "react";
import { paymentService } from "../../../services/payment.service";
import { formatCurrency } from "../../../utils/formatters";

const PaymentPage: React.FC = () => {
  const [payments, setPayments] = React.useState<any[]>([]);

  React.useEffect(() => {
    paymentService.getPayments().then(setPayments);
  }, []);

  return (
    <div className="section">
      <h1>Payment</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.payment_id}><td>{p.payment_id}</td><td>{formatCurrency(p.amount)}</td><td>{p.payment_status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
