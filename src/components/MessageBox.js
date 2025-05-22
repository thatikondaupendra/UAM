import React from 'react';
import styles from '../styles/App.module.css'; // Import CSS Module

const MessageBox = ({ message, type, onClose }) => {
    let typeClass = '';
    switch (type) {
        case 'success':
            typeClass = styles.success;
            break;
        case 'error':
            typeClass = styles.error;
            break;
        case 'info':
            typeClass = styles.info;
            break;
        default:
            typeClass = styles.info; // Default to info
    }

    return (
        <div className={`${styles.messageBox} ${typeClass}`}>
            <p className={styles.messageBoxText}>{message}</p>
            <button onClick={onClose} className={styles.messageBoxCloseButton}>
                &times;
            </button>
        </div>
    );
};

export default MessageBox;