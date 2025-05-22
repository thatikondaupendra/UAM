import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../../components/MessageBox';
import api from '../../services/api';
import styles from '../../styles/App.module.css'; // Import CSS Module

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        try {
            await api.post('/api/auth/signup', { username, password });
            setMessage({ text: 'Registration successful! Please login.', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setMessage({ text: errorMessage, type: 'error' });
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach((err) => {
                    setMessage(prev => ({
                        text: (prev ? prev.text + ' ' : '') + `${err.property}: ${Object.values(err.constraints).join(', ')}`,
                        type: 'error'
                    }));
                });
            }
        }
    };

    return (
        <div className={styles.mainContent}>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Sign Up</h2>
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
                        <label htmlFor="confirmPassword" className={styles.formLabel}>
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={styles.formInput}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <button
                            type="submit"
                            className={styles.secondaryButton}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className={styles.textCenter}>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className={styles.linkButton}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;