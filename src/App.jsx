import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Initialize state as an object to hold all user details
  const [formData, setFormData] = useState({ lastName: '', email: '', firstName: '' });
  const [users, setUsers] = useState([]);

  // Fetch initial users for the list
  useEffect(() => {
    fetch('api/users')
      .then(res => res.json())
      .then(data => setUsers(data.slice(0, 5))); // Get first 5 users
  }, []);

  // 2. Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,        // Keep existing fields
      [name]: value       // Update only the field that changed
    });
  };


  // 3. API POST Integration

  const addUser = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email) {
      alert("Please fill in the required fields!");
      return;
    }

    const res = await fetch('api/users', { // Replace with your ACTUAL URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tell the server JSON is coming
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      })
    });

    if (res.ok) {
      alert(`Welcome, ${formData.firstName}! Account brewed successfully.`);
      setFormData({ firstName: '', lastName: '', email: '' });
      // Optionally refresh the users list
      fetch('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data.slice(0, 5)));
    } else {
      const errorText = await res.text();
      alert(`Error: ${res.status} - ${errorText}`);
    }
  };

  const getInitials = (user) => {
    return user.firstName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'UN';
  };

  return (
    <div className="container">
      <div className="title-row">
        <img src="/jitter-logo-coffee-artistic.svg" alt="Jitter icon" className="app-icon" />
        <h1>The Jitter Feed</h1>
      </div>

      <div className="card">
        <h3>Create Your Profile</h3>
        <form onSubmit={addUser}>
          <div className="form-group">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="list-section">
        <h3>Recent Coffee Enthusiasts</h3>
        <ul className="customer-grid">
          {users.map((u) => (
            <li key={u.id} className="customer-card">
              {/* Generates a circle with the first letter of their name */}
              <div className="avatar">
                {getInitials(u)}
              </div>

              <div className="customer-info">
                <span className="customer-name">{u.firstName} {u.lastName}</span>
                <span className="customer-email">{u.email.toLowerCase()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;