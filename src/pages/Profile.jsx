import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    vehicle: {
      plate: user?.vehicle?.plate || '',
      type: user?.vehicle?.type || ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      vehicle: {
        ...formData.vehicle,
        [name]: value
      }
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mon Profil</h1>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-section">
          <h2>Informations Personnelles</h2>
          
          <div className="form-group">
            <label>Nom</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <p className="info-value">{user?.name}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <p className="info-value">{user?.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <p className="info-value">{user?.phone}</p>
            )}
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <p className="info-value role-badge">{user?.role.toUpperCase()}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Informations du Véhicule</h2>
          
          <div className="form-group">
            <label>Plaque d'immatriculation</label>
            {isEditing ? (
              <input
                type="text"
                name="plate"
                value={formData.vehicle.plate}
                onChange={handleVehicleChange}
              />
            ) : (
              <p className="info-value">{user?.vehicle?.plate}</p>
            )}
          </div>

          <div className="form-group">
            <label>Type de véhicule</label>
            {isEditing ? (
              <select
                name="type"
                value={formData.vehicle.type}
                onChange={handleVehicleChange}
              >
                <option value="Voiture">Voiture</option>
                <option value="Moto">Moto</option>
                <option value="Camion">Camion</option>
                <option value="Bus">Bus</option>
              </select>
            ) : (
              <p className="info-value">{user?.vehicle?.type}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button className="save-btn" onClick={handleSave}>
              Enregistrer les modifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
