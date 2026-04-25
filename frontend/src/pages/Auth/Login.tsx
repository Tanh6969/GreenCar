import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("admin@greencar.vn");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await authService.login(email);
    login(result.token, result.user);
    navigate("/");
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Dang nhap</h1>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Button type="submit">Dang nhap</Button>
    </form>
  );
};

export default LoginPage;
