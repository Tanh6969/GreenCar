import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { useAuth } from "../hooks/useAuth";
import HomePage from "../pages/Public/Home";
import CarListPage from "../pages/Public/CarList";
import CarDetailPage from "../pages/Public/CarDetail";
import BlogListPage from "../pages/Public/Blog";
import BlogDetailPage from "../pages/Public/Blog/Detail";
import CheckoutPage from "../pages/Customer/Checkout";
import PaymentPage from "../pages/Customer/Payment";
import ProfilePage from "../pages/Customer/Profile";
import MyBookingsPage from "../pages/Customer/MyBookings";
import MessagesPage from "../pages/Customer/Messages";
import MessageDetailPage from "../pages/Customer/Messages/Detail";
import LoginPage from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/Register";
import ForgotPasswordPage from "../pages/Auth/ForgotPassword";
import ResetPasswordPage from "../pages/Auth/ResetPassword";
import AdminLoginPage from "../pages/Auth/AdminLogin";
import ConfirmationPage from "../pages/Customer/Confirmation";
import DashboardPage from "../pages/Admin/Dashboard";
import VehicleManagePage from "../pages/Admin/VehicleManage";
import BookingManagePage from "../pages/Admin/BookingManage";
import UserManagePage from "../pages/Admin/UserManage";
import BlogManagePage from "../pages/Admin/BlogManage";
import AdminBlogEditPage from "../pages/Admin/BlogEdit";
import AdminOwnerRegistrations from "../pages/Admin/OwnerRegistrations";
import OwnerRegisterLanding from "../pages/Owner/Register";
import OwnerRegisterSteps from "../pages/Owner/Register/Steps";
import MyVehiclesPage from "../pages/Owner/MyVehicles";

const AppRouter: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAdmin
            ? <Navigate to="/admin/dashboard" replace />
            : <MainLayout><HomePage /></MainLayout>
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
        path="/blog"
        element={
          <MainLayout>
            <BlogListPage />
          </MainLayout>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <MainLayout>
            <BlogDetailPage />
          </MainLayout>
        }
      />

      <Route
        path="/customer/checkout"
        element={
          <MainLayout>
            <CheckoutPage />
          </MainLayout>
        }
      />
      <Route
        path="/customer/payment"
        element={
          <MainLayout>
            <PaymentPage />
          </MainLayout>
        }
      />
      <Route
        path="/customer/confirmation"
        element={
          <MainLayout>
            <ConfirmationPage />
          </MainLayout>
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
        path="/customer/messages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MessagesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/messages/:conversationId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MessageDetailPage />
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
        path="/auth/forgot-password"
        element={
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Owner registration routes */}
      <Route
        path="/owner/register"
        element={<MainLayout><OwnerRegisterLanding /></MainLayout>}
      />
      <Route
        path="/owner/register/steps"
        element={
          <ProtectedRoute>
            <MainLayout><OwnerRegisterSteps /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/my-vehicles"
        element={
          <ProtectedRoute>
            <MainLayout><MyVehiclesPage /></MainLayout>
          </ProtectedRoute>
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
      <Route
        path="/admin/blogs"
        element={
          <AdminRoute>
            <AdminLayout>
              <BlogManagePage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/blogs/new"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminBlogEditPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/blogs/edit/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminBlogEditPage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/owner-registrations"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOwnerRegistrations />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
