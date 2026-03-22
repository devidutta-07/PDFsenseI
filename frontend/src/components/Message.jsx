/**
 * Message Component
 * Displays individual chat messages
 */

import React from 'react';
import '../styles/app.css';

export default function Message({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        {message.text}
      </div>
    </div>
  );
}
