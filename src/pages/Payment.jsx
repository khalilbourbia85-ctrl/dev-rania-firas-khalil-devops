import React, { useState } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Payment.css';

const Payment = () => {
  const { user } = useAuth();
  const { addPayment, payments, RATES, getTotalRevenue } = usePayment();
  const { vehicles } = useParking();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    duration: 1,
    method: 'carte'
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Permissions basées sur les rôles
  const canViewStats = ['admin', 'employee'].includes(user?.role);
  const canMakePayment = true; // Tous les utilisateurs peuvent payer

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculatePrice = () => {
    const duration = parseFloat(formData.duration);
    let price = 0;

    if (duration <= 0.5) price = RATES[0.5];
    else if (duration <= 1) price = RATES[1];
    else if (duration <= 2) price = RATES[2];
    else if (duration <= 4) price = RATES[4];
    else if (duration <= 8) price = RATES[8];
    else price = RATES[24];

    return price;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!canMakePayment) {
      alert('Vous n\'avez pas la permission d\'effectuer un paiement');
      return;
    }
    if (formData.vehicleId) {
      addPayment({
        vehicleId: parseInt(formData.vehicleId),
        method: formData.method,
        duration: parseFloat(formData.duration)
      });
      
      setSuccessMessage(`Paiement de ${calculatePrice()} DT effectué avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setFormData({
        vehicleId: '',
        duration: 1,
        method: 'carte'
      });
      setShowForm(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Gestion des Paiements</h1>
        {canMakePayment && (
          <button 
            className="add-payment-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Fermer' : 'Nouveau paiement'}
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {showForm && (
        <div className="payment-form-card">
          <h2>Traiter un paiement</h2>
          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label>Véhicule</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Sélectionner un véhicule --</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.owner}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Durée de stationnement (heures)</label>
              <input
                type="number"
                name="duration"
                step="0.5"
                min="0.5"
                max="24"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="price-display">
              <p>Prix à payer: <strong className="price">{calculatePrice()} DT</strong></p>
            </div>

            <div className="form-group">
              <label>Mode de paiement</label>
              <div className="payment-methods">
                <label className="method-option">
                  <input
                    type="radio"
                    name="method"
                    value="carte"
                    checked={formData.method === 'carte'}
                    onChange={handleInputChange}
                  />
                  <span>Carte bancaire</span>
                </label>
                <label className="method-option">
                  <input
                    type="radio"
                    name="method"
                    value="espece"
                    checked={formData.method === 'espece'}
                    onChange={handleInputChange}
                  />
                  <span>Espèces</span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Effectuer le paiement
            </button>
          </form>
        </div>
      )}

      <div className="pricing-card">
        <h2>Tarification</h2>
        <div className="pricing-table">
          <div className="pricing-row">
            <span>Jusqu'à 30 minutes</span>
            <span className="price">{RATES[0.5]} DT</span>
          </div>
          <div className="pricing-row">
            <span>Jusqu'à 1 heure</span>
            <span className="price">{RATES[1]} DT</span>
          </div>
          <div className="pricing-row">
            <span>Jusqu'à 2 heures</span>
            <span className="price">{RATES[2]} DT</span>
          </div>
          <div className="pricing-row">
            <span>Jusqu'à 4 heures</span>
            <span className="price">{RATES[4]} DT</span>
          </div>
          <div className="pricing-row">
            <span>Jusqu'à 8 heures</span>
            <span className="price">{RATES[8]} DT</span>
          </div>
          <div className="pricing-row">
            <span>24 heures</span>
            <span className="price">{RATES[24]} DT</span>
          </div>
        </div>
      </div>

      {canViewStats && (
        <div className="statistics-card">
          <h2>Statistiques</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <p className="stat-label">Total des paiements</p>
              <p className="stat-value">{getTotalRevenue()} DT</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">Nombre de transactions</p>
              <p className="stat-value">{payments.length}</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">Montant moyen</p>
              <p className="stat-value">
                {payments.length > 0 ? (getTotalRevenue() / payments.length).toFixed(2) : 0} DT
              </p>
            </div>
          </div>
        </div>
      )}

      {canViewStats && (
        <div className="payments-history">
          <h2>Historique des paiements</h2>
          {payments.length === 0 ? (
            <div className="empty-state">
              <p>Aucun paiement enregistré</p>
            </div>
          ) : (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>ID Véhicule</th>
                  <th>Montant</th>
                  <th>Durée</th>
                  <th>Mode de paiement</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>#{payment.vehicleId}</td>
                    <td className="amount">{payment.amount} DT</td>
                    <td>{payment.duration}h</td>
                    <td>
                      <span className="method-badge">
                        {payment.method === 'carte' ? 'Carte' : 'Espèces'}
                      </span>
                    </td>
                    <td>{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className="status-badge paid">{payment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;
