import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Clients from "./pages/Clients";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

// 🔐 PRIVATE ROUTE
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
};
// Wrapper (needed for useLocation)
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const location = useLocation();

  const isLoggedIn = localStorage.getItem("token");

  return (
    <>
      {/* ✅ Show Navbar only after login */}
      {isLoggedIn && location.pathname !== "/" && location.pathname !== "/register" && (
        <Navbar />
      )}

      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <Clients />
            </PrivateRoute>
          }
        />

        {/* 🔁 Optional: redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default AppWrapper;