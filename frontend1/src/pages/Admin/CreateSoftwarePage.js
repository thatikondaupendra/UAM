import React, { useState } from 'react';
import MessageBox from '../../components/MessageBox';
import api from '../../services/api';
import styles from '../../styles/App.module.css'; // Import CSS Module

const CreateSoftwarePage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [accessLevels, setAccessLevels] = useState([]);
    const [message, setMessage] = useState(null);

    const handleAccessLevelChange = (e) => {
        const { value, checked } = e.target;
        setAccessLevels(prev =>
            checked ? [...prev, value] : prev.filter(level => level !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (accessLevels.length === 0) {
            setMessage({ text: 'Please select at least one access level.', type: 'error' });
            return;
        }
        try {
            await api.post('/admin/software', { name, description, accessLevels });
            setMessage({ text: 'Software created successfully!', type: 'success' });
            setName('');
            setDescription('');
            setAccessLevels([]);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create software.';
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
                <h2 className={styles.formTitle}>Create New Software</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.formLabel}>
                            Software Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={styles.formInput}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.formLabel}>
                            Description:
                        </label>
                        <textarea
                            id="description"
                            rows="4"
                            className={styles.formTextarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Access Levels:
                        </label>
                        <div className={styles.checkboxGroup}>
                            {['Read', 'Write', 'Admin'].map(level => (
                                <label key={level} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkboxInput}
                                        value={level}
                                        checked={accessLevels.includes(level)}
                                        onChange={handleAccessLevelChange}
                                    />
                                    <span>{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={styles.primaryButton}
                    >
                        Create Software
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSoftwarePage;