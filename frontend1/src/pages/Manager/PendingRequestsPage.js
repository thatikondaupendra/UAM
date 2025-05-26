import React, { useState, useEffect, useCallback } from 'react';
import MessageBox from '../../components/MessageBox';
import api from '../../services/api';
import styles from '../../styles/App.module.css'; // Import CSS Module

const PendingRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState(null);

    const fetchPendingRequests = useCallback(async () => {
        try {
            const response = await api.get('/requests/pending');
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            setMessage({ text: 'Failed to load pending requests.', type: 'error' });
        }
    }, []);

    useEffect(() => {
        fetchPendingRequests();
    }, [fetchPendingRequests]);

    const handleStatusUpdate = async (requestId, status) => {
        setMessage(null);
        try {
            await api.patch(`manager/requests/${requestId}`, { status });
            setMessage({ text: `Request ${status.toLowerCase()} successfully!`, type: 'success' });
            fetchPendingRequests(); // Refresh the list
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Failed to ${status.toLowerCase()} request.`;
            setMessage({ text: errorMessage, type: 'error' });
        }
    };

    return (
        <div className={styles.mainContent}>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
            <div className={styles.tableContainer}>
                <h2 className={styles.formTitle}>Pending Access Requests</h2>
                {requests.length === 0 ? (
                    <p className={styles.textCenter}>No pending requests found.</p>
                ) : (
                    <div className={styles.overflowAuto}> {/* Added for responsive table scrolling */}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Software</th>
                                    <th>Access Type</th>
                                    <th>Reason</th>
                                    <th>Requested At</th>
                                    <th className={styles.textCenter}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.user.username}</td>
                                        <td>{request.software.name}</td>
                                        <td>{request.accessType}</td>
                                        <td>{request.reason}</td>
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td className={styles.textCenter}>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'Approved')}
                                                className={`${styles.actionButton} ${styles.approve}`}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                                                className={`${styles.actionButton} ${styles.reject}`}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequestsPage;