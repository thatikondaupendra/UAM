import React, { useState, useEffect, useCallback } from 'react';
import MessageBox from '../../components/MessageBox';
import api from '../../services/api';
import styles from '../../styles/App.module.css'; // Import CSS Module

const RequestAccessPage = () => {
    const [softwareList, setSoftwareList] = useState([]);
    const [selectedSoftwareId, setSelectedSoftwareId] = useState('');
    const [accessType, setAccessType] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState(null);

    const fetchSoftware = useCallback(async () => {
        try {
            alert("fs");
            const response = await api.get('employee/software')
            console.log(response.data.data[0]);
            setSoftwareList(response.data.data);
        } catch (error) {
            console.error("Error fetching software:", error);
            setMessage({ text: 'Failed to load software list.', type: 'error' });
        }
    }, []);

    useEffect(() => {
        fetchSoftware();
    }, [fetchSoftware]);

    const handleSoftwareChange = (e) => {
        const id = e.target.value;
        setSelectedSoftwareId(id);
        setAccessType(''); // Reset access type when software changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (!selectedSoftwareId || !accessType || !reason) {
            setMessage({ text: 'All fields are required.', type: 'error' });
            return;
        }
        try {
            await api.post('/requests', {
                softwareId: parseInt(selectedSoftwareId),
                accessType,
                reason,
            });
            setMessage({ text: 'Access request submitted successfully!', type: 'success' });
            setSelectedSoftwareId('');
            setAccessType('');
            setReason('');
            fetchSoftware(); // Refresh software list if needed, or just clear form
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit request.';
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

    const selectedSoftware = softwareList.find(s => s.id === parseInt(selectedSoftwareId));

    return (
        <div className={styles.mainContent}>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Request Software Access</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="software" className={styles.formLabel}>
                            Software:
                        </label>
                        <select
                            id="software"
                            className={styles.formSelect}
                            value={selectedSoftwareId}
                            onChange={handleSoftwareChange}
                            required
                        >
                            <option value="">Select Software</option>
                            {softwareList.map(software => (
                                <option key={software.id} value={software.id}>
                                    {software.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedSoftware && (
                        <div className={styles.formGroup}>
                            <label htmlFor="accessType" className={styles.formLabel}>
                                Access Type:
                            </label>
                            <select
                                id="accessType"
                                className={styles.formSelect}
                                value={accessType}
                                onChange={(e) => setAccessType(e.target.value)}
                                required
                            >
                                <option value="">Select Access Type</option>
                                {selectedSoftware.accessLevels.map(level => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="reason" className={styles.formLabel}>
                            Reason for Access:
                        </label>
                        <textarea
                            id="reason"
                            rows="4"
                            className={styles.formTextarea}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className={styles.primaryButton}
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestAccessPage;