import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    console.log("ProtectedRoute - isLoggedIn state:", isLoggedIn);
    
    // If the context says we're logged in, we're logged in.
    // Don't check the cookie directly since it's httpOnly
    return isLoggedIn ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
