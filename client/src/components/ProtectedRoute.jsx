import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    console.log("ProtectedRoute - isLoggedIn state:", isLoggedIn);
    
    // Check both context state and cookie for robust protection
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];
    
    console.log("ProtectedRoute - cookie check:", !!token);

    return (token || isLoggedIn) ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
