import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from '../styles/App.module.css'; // Import CSS Module

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarBrand}>UAM System</div>
            <div className={styles.flexContainer}> {/* Using a generic flex container for buttons */}
                {isAuthenticated ? (
                    <>
                        <span className={styles.navbarUser}>Welcome, {user?.username} ({user?.role})</span>
                        {user?.role === 'Admin' && (
                            <button
                                onClick={() => navigate('/create-software')}
                                className={styles.navbarButton}
                            >
                                Create Software
                            </button>
                        )}
                        {user?.role === 'Employee' && (
                            <button
                                onClick={() => navigate('/request-access')}
                                className={styles.navbarButton}
                            >
                                Request Access
                            </button>
                        )}
                        {user?.role === 'Manager' && (
                            <button
                                onClick={() => navigate('/pending-requests')}
                                className={styles.navbarButton}
                            >
                                Pending Requests
                            </button>
                        )}
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className={`${styles.navbarButton} ${styles.logout}`}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            className={styles.navbarButton}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className={`${styles.navbarButton} ${styles.signup}`}
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;