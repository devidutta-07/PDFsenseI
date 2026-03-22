/**
 * Sidebar Component
 * Handles document upload and chat information
 */

import React from 'react';
import UploadPanel from './UploadPanel';
import '../styles/app.css';

export default function Sidebar({ chatId, onDocumentsUploaded, hasDocuments }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>📄 PDFsenseI</h2>
        <p className="chat-id">ID: {chatId.slice(0, 8)}...</p>
      </div>
      
      <UploadPanel 
        chatId={chatId} 
        onDocumentsUploaded={onDocumentsUploaded}
      />
      
      <div className="sidebar-info">
        {hasDocuments ? (
          <div className="status success">
            ✓ Documents loaded
          </div>
        ) : (
          <div className="status pending">
            ⊘ No documents
          </div>
        )}
      </div>
    </aside>
  );
}
