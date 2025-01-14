import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/" />;
  }

  // If token exists, allow access to the route
  return children;
};

export default PrivateRoute;
