// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Auth from './components/Auth';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('username'));

  useEffect(() => {
    if (user) {
      socket.emit('join', user);

      socket.on('past messages', (msgs) => {
        setMessages(msgs);
      });

      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off('chat message');
        socket.off('past messages');
      };
    }
  }, [user]);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = { sender: user, text: message, timestamp: new Date() };
      socket.emit('chat message', msg);
      setMessage('');
    }
  };

  return (
    <div className="app-container">
      {user ? (
        <div className="chat-container">
          <h1>Chat App</h1>
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === user ? 'my-message' : 'incoming-message'}`}
              >
                <span>{msg.text}</span>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <Auth setUser={setUser} />
      )}
    </div>
  );
}

export default App;
