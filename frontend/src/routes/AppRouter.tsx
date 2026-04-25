import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import HomePage from "../pages/Public/Home";
import CarListPage from "../pages/Public/CarList";
import CarDetailPage from "../pages/Public/CarDetail";
import CheckoutPage from "../pages/Customer/Checkout";
import PaymentPage from "../pages/Customer/Payment";
import ProfilePage from "../pages/Customer/Profile";
import MyBookingsPage from "../pages/Customer/MyBookings";
import LoginPage from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/Register";
import DashboardPage from "../pages/Admin/Dashboard";
import VehicleManagePage from "../pages/Admin/VehicleManage";
import BookingManagePage from "../pages/Admin/BookingManage";
import UserManagePage from "../pages/Admin/UserManage";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/cars"
        element={
          <MainLayout>
            <CarListPage />
          </MainLayout>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <MainLayout>
            <CarDetailPage />
          </MainLayout>
        }
      />

      <Route
        path="/customer/checkout"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CheckoutPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/payment"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/my-bookings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyBookingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/auth/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/vehicles"
        element={
          <AdminRoute>
            <AdminLayout>
              <VehicleManagePage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminLayout>
              <BookingManagePage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <UserManagePage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
