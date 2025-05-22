import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import CreateSoftwarePage from './pages/Admin/CreateSoftwarePage';
import RequestAccessPage from './pages/Employee/RequestAccessPage';
import PendingRequestsPage from './pages/Manager/PendingRequestsPage';

// Import CSS Module
import styles from './styles/App.module.css';

const App = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Effect to handle initial redirection after login or on app load
    useEffect(() => {
        if (isAuthenticated && user) {
            if (window.location.pathname === '/' || window.location.pathname === '/login' || window.location.pathname === '/signup') {
                if (user.role === 'Admin') {
                    navigate('/create-software', { replace: true });
                } else if (user.role === 'Manager') {
                    navigate('/pending-requests', { replace: true });
                } else if (user.role === 'Employee') {
                    navigate('/request-access', { replace: true });
                }
            }
        } else if (!isAuthenticated && window.location.pathname !== '/signup') {
            // If not authenticated and not on signup page, redirect to login
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className={styles.appContainer}>
            <Navbar />
            {/* Removed the test H1 element */}
            <main className={styles.mainContent}>
                <Routes>
                    {/* AuthProvider is already wrapping RootApp, no need to wrap LoginPage again */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route path="/create-software" element={
                        <ProtectedRoute roles={['Admin']}>
                            <CreateSoftwarePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/request-access" element={
                        <ProtectedRoute roles={['Employee']}>
                            <RequestAccessPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/pending-requests" element={
                        <ProtectedRoute roles={['Manager']}>
                            <PendingRequestsPage />
                        </ProtectedRoute>
                    } />

                    {/* Default redirect for authenticated users, or login for unauthenticated */}
                    <Route
                        path="/"
                        element={isAuthenticated ? (
                            user?.role === 'Admin' ? <Navigate to="/create-software" replace /> :
                            user?.role === 'Manager' ? <Navigate to="/pending-requests" replace /> :
                            user?.role === 'Employee' ? <Navigate to="/request-access" replace /> :
                            <div className={styles.infoPageContainer}>
                                <div className={styles.infoPageContent}>
                                    <p className={styles.infoPageText}>Welcome to the UAM System!</p>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )}
                    />
                    {/* Catch-all for unknown routes */}
                    <Route path="*" element={
                        <div className={styles.infoPageContainer}>
                            <div className={styles.infoPageContent}>
                                <h2 className={styles.infoPageTitle}>404 - Page Not Found</h2>
                                <p className={styles.infoPageText}>The page you are looking for does not exist.</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className={styles.infoPageButton}
                                >
                                    Go to Home
                                </button>
                            </div>
                        </div>
                    } />
                </Routes>
            </main>
        </div>
    );
};

// This is the entry point that will be rendered by ReactDOM.
// It wraps the main App component with the AuthProvider and Router.
const RootApp = () => (
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
);

export default RootApp;
