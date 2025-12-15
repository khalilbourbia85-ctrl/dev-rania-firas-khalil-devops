import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Users.css';

const Users = () => {
  const { users, user, addUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    vehiclePlate: '',
    vehicleType: 'Voiture'
  });

  // Permissions basées sur les rôles
  const canViewUsers = ['admin', 'employee'].includes(user?.role);
  const canAddUser = user?.role === 'admin';

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newUser = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      vehicle: {
        plate: formData.vehiclePlate || 'Non assigné',
        type: formData.vehicleType
      }
    };

    addUser(newUser);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      vehiclePlate: '',
      vehicleType: 'Voiture'
    });
    setShowForm(false);
    alert('Utilisateur ajouté avec succès!');
  };

  if (!canViewUsers) {
    return (
      <div className="users-container">
        <div className="users-header">
          <h1>Gestion des Utilisateurs</h1>
        </div>
        <div className="empty-state">
          <p>Vous n'avez pas la permission d'accéder à cette page</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'admin';
      case 'employee': return 'employee';
      case 'user': return 'user';
      default: return '';
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Administrateur';
      case 'employee': return 'Employé';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Gestion des Utilisateurs</h1>
        <p className="subtitle">Gérez tous les utilisateurs du système de parking</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {canAddUser && (
            <button className="add-user-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Annuler' : '+ Ajouter un utilisateur'}
            </button>
          )}
          <button
            className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
            onClick={() => setFilterRole('all')}
          >
            Tous ({users.length})
          </button>
          <button
            className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
            onClick={() => setFilterRole('admin')}
          >
            Administrateurs ({users.filter(u => u.role === 'admin').length})
          </button>
          <button
            className={`filter-btn ${filterRole === 'employee' ? 'active' : ''}`}
            onClick={() => setFilterRole('employee')}
          >
            Employés ({users.filter(u => u.role === 'employee').length})
          </button>
          <button
            className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
            onClick={() => setFilterRole('user')}
          >
            Utilisateurs ({users.filter(u => u.role === 'user').length})
          </button>
        </div>
      </div>

      {showForm && canAddUser && (
        <div className="add-user-form-container">
          <h2>Ajouter un nouvel utilisateur</h2>
          <form onSubmit={handleSubmitForm} className="add-user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="jean@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Sécurisé"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="user">Utilisateur</option>
                  <option value="employee">Employé</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleType">Type de véhicule</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleFormChange}
                >
                  <option value="Voiture">Voiture</option>
                  <option value="Moto">Moto</option>
                  <option value="Camping-car">Camping-car</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="vehiclePlate">Plaque d'immatriculation</label>
                <input
                  type="text"
                  id="vehiclePlate"
                  name="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={handleFormChange}
                  placeholder="ABC123 (optionnel)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Ajouter l'utilisateur</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map(u => (
            <div key={u.id} className="user-card">
              <div className="user-header-info">
                <div className="user-avatar">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-name-role">
                  <h3>{u.name}</h3>
                  <span className={`role-badge ${getRoleBadgeColor(u.role)}`}>
                    {getRoleLabel(u.role)}
                  </span>
                </div>
              </div>

              <div className="user-details">
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{u.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Téléphone:</span>
                  <span className="value">{u.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">ID Utilisateur:</span>
                  <span className="value">#{u.id}</span>
                </div>
              </div>

              <div className="vehicle-info">
                <p className="vehicle-label">🚗 Véhicule:</p>
                <p className="vehicle-plate">{u.vehicle?.plate}</p>
                <p className="vehicle-type">{u.vehicle?.type}</p>
              </div>

              {user?.id === u.id && (
                <div className="current-user-badge">
                  ✓ Profil actuel
                </div>
              )}

              <div className="user-actions">
                <button className="action-btn view">
                  👁️ Voir détails
                </button>
                {user?.role === 'admin' && user?.id !== u.id && (
                  <>
                    <button className="action-btn edit">
                      ✏️ Modifier
                    </button>
                    <button className="action-btn delete">
                      🗑️ Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="users-statistics">
        <h2>Statistiques</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-number">{users.length}</p>
            <p className="stat-name">Utilisateurs totaux</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{users.filter(u => u.role === 'admin').length}</p>
            <p className="stat-name">Administrateurs</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{users.filter(u => u.role === 'employee').length}</p>
            <p className="stat-name">Employés</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{users.filter(u => u.role === 'user').length}</p>
            <p className="stat-name">Utilisateurs réguliers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
