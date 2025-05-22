import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from '../styles/App.module.css'; // Import CSS Module

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return (
            <div className={styles.infoPageContainer}>
                <div className={styles.infoPageContent}>
                    <h2 className={styles.infoPageTitle}>Access Denied</h2>
                    <p className={styles.infoPageText}>You do not have permission to view this page.</p>
                    <button
                        onClick={() => window.history.back()}
                        className={styles.infoPageButton}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;