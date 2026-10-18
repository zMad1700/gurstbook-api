import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:3000/api/messages';

  // TODO 4
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, []);

  // TODO 5
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });
      if (res.ok) {
        setName('');
        setMessage('');
        const refreshed = await fetch(API_URL);
        setMessages(await refreshed.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Portfolio Guestbook</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Sign Guestbook</button>
      </form>

      <div>
        <h3>Messages:</h3>
        {messages.map((msg) => (
          <div key={msg.id} style={{ border: '1px solid gray', margin: '10px 0', padding: '10px' }}>
            <strong>{msg.name}</strong> says:
            <p>{msg.message}</p>
            <small>{new Date(msg.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;