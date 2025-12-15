import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
      setPassword('');
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@parking.com');
      setPassword('admin123');
    } else if (role === 'employee') {
      setEmail('employee@parking.com');
      setPassword('emp123');
    } else {
      setEmail('user@parking.com');
      setPassword('user123');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Parking Management</h1>
          <p>Système de gestion de parking professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="login-btn">Connexion</button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Comptes de démonstration</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="demo-btn admin"
              onClick={() => fillDemoCredentials('admin')}
            >
              Administrateur
            </button>
            <button 
              type="button" 
              className="demo-btn employee"
              onClick={() => fillDemoCredentials('employee')}
            >
              Employé
            </button>
            <button 
              type="button" 
              className="demo-btn user"
              onClick={() => fillDemoCredentials('user')}
            >
              Utilisateur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
