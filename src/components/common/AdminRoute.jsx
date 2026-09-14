import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth"

function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="route-loading">
                Checking admin access...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;