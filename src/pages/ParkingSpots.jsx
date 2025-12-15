import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import '../styles/ParkingSpots.css';

const ParkingSpots = () => {
  const { user } = useAuth();
  const { parkingSpots, reserveSpot, releaseSpot, addParkingSpot, removeParkingSpot } = useParking();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    spotNumber: '',
    floor: 1,
    type: 'standard'
  });

  const floors = [...new Set(parkingSpots.map(spot => spot.floor))].sort();
  const spotsByFloor = parkingSpots.filter(spot => spot.floor === selectedFloor);

  // Permissions basées sur les rôles
  const canAddSpot = ['admin', 'employee'].includes(user?.role);
  const canRemoveSpot = ['admin', 'employee'].includes(user?.role);
  const canReleaseSpot = ['admin', 'employee'].includes(user?.role);
  const canReserveSpot = true; // Tous les utilisateurs peuvent réserver

  const handleReserve = (spotId) => {
    reserveSpot(spotId, 1);
    alert('Place réservée avec succès!');
  };

  const handleRelease = (spotId) => {
    if (!canReleaseSpot) {
      alert('Vous n\'avez pas la permission de libérer une place');
      return;
    }
    releaseSpot(spotId);
    alert('Place libérée avec succès!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSpot = (e) => {
    e.preventDefault();
    if (!canAddSpot) {
      alert('Vous n\'avez pas la permission d\'ajouter une place');
      return;
    }
    if (formData.spotNumber) {
      addParkingSpot(formData);
      setFormData({
        spotNumber: '',
        floor: 1,
        type: 'standard'
      });
      setShowForm(false);
      alert('Place ajoutée avec succès!');
    }
  };

  const getSpotClass = (status) => {
    switch(status) {
      case 'available': return 'spot-available';
      case 'occupied': return 'spot-occupied';
      case 'reserved': return 'spot-reserved';
      default: return '';
    }
  };

  const stats = {
    available: parkingSpots.filter(s => s.status === 'available').length,
    occupied: parkingSpots.filter(s => s.status === 'occupied').length,
    reserved: parkingSpots.filter(s => s.status === 'reserved').length,
  };

  return (
    <div className="parking-container">
      <div className="parking-header">
        <h1>Gestion des Places de Parking</h1>
        {canAddSpot && (
          <button 
            className="add-parking-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Fermer' : 'Ajouter une place'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="parking-form-card">
          <h2>Ajouter une nouvelle place de parking</h2>
          <form onSubmit={handleAddSpot}>
            <div className="form-group">
              <label>Numéro de place</label>
              <input
                type="text"
                name="spotNumber"
                value={formData.spotNumber}
                onChange={handleInputChange}
                placeholder="Ex: C1, C2..."
                required
              />
            </div>

            <div className="form-group">
              <label>Étage</label>
              <select
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
              >
                <option value={1}>Étage 1</option>
                <option value={2}>Étage 2</option>
                <option value={3}>Étage 3</option>
                <option value={4}>Étage 4</option>
                <option value={5}>Étage 5</option>
              </select>
            </div>

            <div className="form-group">
              <label>Type de place</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="standard">Standard</option>
                <option value="handicap">Handicap</option>
                <option value="reserved">Réservée</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Ajouter la place
            </button>
          </form>
        </div>
      )}

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-color available"></span>
          <p>Disponible: <strong>{stats.available}</strong></p>
        </div>
        <div className="stat">
          <span className="stat-color occupied"></span>
          <p>Occupée: <strong>{stats.occupied}</strong></p>
        </div>
        <div className="stat">
          <span className="stat-color reserved"></span>
          <p>Réservée: <strong>{stats.reserved}</strong></p>
        </div>
      </div>

      <div className="floor-selector">
        <h2>Sélectionner un étage:</h2>
        <div className="floor-buttons">
          {floors.map(floor => (
            <button
              key={floor}
              className={`floor-btn ${selectedFloor === floor ? 'active' : ''}`}
              onClick={() => setSelectedFloor(floor)}
            >
              Étage {floor}
            </button>
          ))}
        </div>
      </div>

      <div className="spots-grid">
        {spotsByFloor.map(spot => (
          <div
            key={spot.id}
            className={`spot ${getSpotClass(spot.status)}`}
          >
            <div className="spot-number">{spot.spotNumber}</div>
            
            {spot.status === 'available' && (
              <button 
                className="spot-action-btn"
                onClick={() => handleReserve(spot.id)}
                title="Réserver cette place"
              >
                Réserver
              </button>
            )}
            
            {spot.status === 'occupied' && (
              <button 
                className="spot-action-btn release"
                onClick={() => handleRelease(spot.id)}
                title="Libérer cette place"
              >
                Libérer
              </button>
            )}

            <small className="spot-status">
              {spot.status === 'available' && 'Disponible'}
              {spot.status === 'occupied' && 'Occupée'}
              {spot.status === 'reserved' && 'Réservée'}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingSpots;
