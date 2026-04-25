import React from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { authService } from "../../services/auth.service";

const RegisterPage: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.register({ name, email, phone: "", license_no: "" });
    alert("Dang ky thanh cong (mock)");
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Dang ky</h1>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ho ten" />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Button type="submit">Tao tai khoan</Button>
    </form>
  );
};

export default RegisterPage;
