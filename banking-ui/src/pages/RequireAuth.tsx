import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Checks if the user has an active, unexpired session in localStorage.
 * @returns {object|null} The session data or null if expired/missing.
 */
const getActiveSession = () => {
    const sessionStr = localStorage.getItem('bankingUserSession');
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    const currentTime = new Date().getTime();

    // Check if session is expired
    if (currentTime > session.expiry) {
        localStorage.removeItem('bankingUserSession'); 
        return null;
    }

    return session;
};

export default function RequireAuth({ children, allowedRoles }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const session = getActiveSession();

        if (session) {
            if (allowedRoles.includes(session.role)) {
                setIsAuthenticated(true);
            } else {
                navigate('/', { replace: true });
                alert("Access Denied: You do not have permission for this area.");
            }
        } else {
            navigate('/', { replace: true });
            alert("Session Expired or Missing. Please log in.");
        }
    }, [navigate, allowedRoles]);

    return isAuthenticated ? children : null;
}