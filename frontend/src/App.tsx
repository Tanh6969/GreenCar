import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import AppRouter from "./routes/AppRouter";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
