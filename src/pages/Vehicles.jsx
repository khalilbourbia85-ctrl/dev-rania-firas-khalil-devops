import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Vehicles.css';

const Vehicles = () => {
  const { vehicles, addVehicle, removeVehicle } = useParking();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    plate: '',
    owner: user?.name || '',
    type: 'Voiture'
  });

  // Permissions basées sur les rôles
  const canRemoveVehicle = ['admin', 'employee'].includes(user?.role);
  const canAddVehicle = true; // Tous les utilisateurs peuvent ajouter un véhicule

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!canAddVehicle) {
      alert('Vous n\'avez pas la permission d\'ajouter un véhicule');
      return;
    }
    if (formData.plate && formData.owner) {
      addVehicle({
        ...formData,
        entryTime: new Date(),
        spotId: null
      });
      setFormData({
        plate: '',
        owner: user?.name || '',
        type: 'Voiture'
      });
      setShowForm(false);
      alert('Véhicule ajouté avec succès!');
    }
  };

  const handleRemoveVehicle = (vehicleId) => {
    if (!canRemoveVehicle) {
      alert('Vous n\'avez pas la permission de supprimer un véhicule');
      return;
    }
    removeVehicle(vehicleId);
    alert('Véhicule supprimé avec succès!');
  };

  const getEntryDuration = (entryTime) => {
    const now = new Date();
    const diff = now - entryTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="vehicles-container">
      <div className="vehicles-header">
        <h1>Gestion des Véhicules</h1>
        <button 
          className="add-vehicle-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Fermer' : 'Ajouter un véhicule'}
        </button>
      </div>

      {showForm && (
        <div className="vehicle-form-card">
          <h2>Ajouter un nouveau véhicule</h2>
          <form onSubmit={handleAddVehicle}>
            <div className="form-group">
              <label>Plaque d'immatriculation</label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleInputChange}
                placeholder="Ex: ABC123"
                required
              />
            </div>

            <div className="form-group">
              <label>Propriétaire</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Type de véhicule</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="Voiture">Voiture</option>
                <option value="Moto">Moto</option>
                <option value="Camion">Camion</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Ajouter le véhicule
            </button>
          </form>
        </div>
      )}

      <div className="vehicles-list">
        <h2>Véhicules actuellement stationnés ({vehicles.length})</h2>
        
        {vehicles.length === 0 ? (
          <div className="empty-state">
            <p>Aucun véhicule stationné pour le moment</p>
          </div>
        ) : (
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Plaque</th>
                <th>Propriétaire</th>
                <th>Type</th>
                <th>Durée de stationnement</th>
                <th>Heure d'entrée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="plate">{vehicle.plate}</td>
                  <td>{vehicle.owner}</td>
                  <td>
                    <span className="vehicle-type-badge">
                      {vehicle.type}
                    </span>
                  </td>
                  <td>{getEntryDuration(vehicle.entryTime)}</td>
                  <td>{new Date(vehicle.entryTime).toLocaleTimeString('fr-FR')}</td>
                  <td>
                    {canRemoveVehicle && (
                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveVehicle(vehicle.id)}
                        title="Supprimer ce véhicule"
                      >
                        Supprimer
                      </button>
                    )}
                    {!canRemoveVehicle && (
                      <span style={{color: '#999', fontSize: '12px'}}>Non autorisé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
