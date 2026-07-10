import React from "react";
import { Navigate, useLocation, matchPath } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";

export default function RequireAuth() {
    const { user } = useAuth();
    const location = useLocation();

    // 1) Giriş yapılmamışsa login'e yönlendir
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // 2) Rol bu rotaya erişemiyorsa kendi ana sayfasına yönlendir
    const role = ROLES[user.role];
    const allowed =
        role &&
        role.allowed.some((pattern) => {
            if (pattern === location.pathname) return true;
            // E.g. support parameterized routes like /events/:id
            return !!matchPath(pattern, location.pathname);
        });

    if (!allowed) {
        return <Navigate to={role ? role.home : "/login"} replace />;
    }

    return <AppLayout />;
}