/**
 * UploadPanel Component
 * Handles PDF file uploads
 */

import React, { useState } from 'react';
import api from '../services/api';
import '../styles/app.css';

export default function UploadPanel({ chatId, onDocumentsUploaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.uploadDocs(chatId, files);
      const result = await response.json();
      
      if (result.status === 'indexed') {
        onDocumentsUploaded();
        e.target.value = ''; // Reset input
      } else {
        setError(result.message || 'Error uploading documents');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-panel">
      <label className="upload-label">
        <div className="upload-box">
          <span className="upload-icon">📁</span>
          <span className="upload-text">
            {loading ? 'Uploading...' : 'Drop PDFs here or click'}
          </span>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
        </div>
      </label>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}
