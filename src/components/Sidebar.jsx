import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  const menuItems = {
    admin: [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/profile', label: 'Profil' },
      { path: '/parking-spots', label: 'Places de parking' },
      { path: '/vehicles', label: 'Véhicules' },
      { path: '/payment', label: 'Paiements' },
      { path: '/users', label: 'Utilisateurs' },
    ],
    employee: [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/profile', label: 'Profil' },
      { path: '/parking-spots', label: 'Places de parking' },
      { path: '/vehicles', label: 'Véhicules' },
      { path: '/payment', label: 'Paiements' },
      { path: '/users', label: 'Utilisateurs' },
    ],
    user: [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/profile', label: 'Profil' },
      { path: '/parking-spots', label: 'Places de parking' },
      { path: '/payment', label: 'Paiements' },
    ]
  };

  const currentMenuItems = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">Parking</span>
          </div>
          <button 
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Réduire' : 'Agrandir'}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          {isOpen && (
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-menu">
          {currentMenuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              title={!isOpen ? item.label : ''}
            >
              {isOpen && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Déconnexion"
          >
            {isOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      <div 
        className="sidebar-overlay"
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
};

export default Sidebar;
