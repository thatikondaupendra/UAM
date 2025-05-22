import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../components/MessageBox';
import api from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import styles from '../../styles/App.module.css'; // Import CSS Module

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, role } = response.data;
            const payload = JSON.parse(atob(token.split('.')[1]));
            login(token, { id: payload.userId, username: payload.username || username, role });
            setMessage({ text: 'Login successful!', type: 'success' });
            if (role === 'Admin') navigate('/create-software');
            else if (role === 'Manager') navigate('/pending-requests');
            else if (role === 'Employee') navigate('/request-access');
            else navigate('/dashboard'); // Fallback
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setMessage({ text: errorMessage, type: 'error' });
        }
    };

    return (
        <div className={styles.mainContent}>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.formLabel}>
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            className={styles.formInput}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={styles.formInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <p className={styles.textCenter}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/signup')}
                        className={styles.linkButton}
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;