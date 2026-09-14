import { useState } from "react";

import AuthContext from "./AuthContextValue";
import { apiRequest } from "../api/api";

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("access_token")
    );

    function login({
        access_token,
        refresh_token,
        user,
    }) {
        localStorage.setItem(
            "access_token",
            access_token
        );

        localStorage.setItem(
            "refresh_token",
            refresh_token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        setAccessToken(access_token);
        setUser(user);
    }

    async function logout() {
        const refreshToken =
            localStorage.getItem("refresh_token");

        try {
            if (refreshToken) {
                await apiRequest("/auth/logout", {
                    method: "POST",
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                });
            }
        } catch (error) {
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");

            setAccessToken(null);
            setUser(null);
        }
    }

    const value = {
        user,
        accessToken,
        isAuthenticated: Boolean(accessToken),
        loading: false,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;