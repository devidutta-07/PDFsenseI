/**
 * ChatWindow Component
 * Main chat interface for asking questions
 */

import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import '../styles/app.css';

export default function ChatWindow({ onAskQuestion, isLoading }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get AI response
    const response = await onAskQuestion(input);
    
    if (response) {
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'assistant'
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>Welcome to PDFsenseI</h2>
            <p>Upload documents in the sidebar and ask questions about them.</p>
          </div>
        )}
        
        {messages.map(message => (
          <Message 
            key={message.id} 
            message={message}
          />
        ))}
        
        {isLoading && (
          <div className="message assistant-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
}
