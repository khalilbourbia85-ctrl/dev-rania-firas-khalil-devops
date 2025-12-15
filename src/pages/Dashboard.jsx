import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { usePayment } from '../context/PaymentContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const { user } = useAuth();
  const { parkingSpots, vehicles } = useParking();
  const { getTotalRevenue, payments, RATES } = usePayment();

  const availableSpots = parkingSpots.filter(s => s.status === 'available').length;
  const occupiedSpots = parkingSpots.filter(s => s.status === 'occupied').length;

  // Données pour le graphique circulaire (places)
  const parkingChartData = {
    labels: ['Disponibles', 'Occupées'],
    datasets: [{
      data: [availableSpots, occupiedSpots],
      backgroundColor: ['#27ae60', '#c0392b'],
      borderColor: '#fafafa',
      borderWidth: 2,
    }]
  };

  // Données pour le graphique à barres (véhicules par étage)
  const vehiclesByFloor = {
    0: vehicles.filter(v => v.floor === 0).length,
    1: vehicles.filter(v => v.floor === 1).length,
  };

  const vehiclesChartData = {
    labels: ['Étage 0', 'Étage 1'],
    datasets: [{
      label: 'Nombre de véhicules',
      data: [vehiclesByFloor[0], vehiclesByFloor[1]],
      backgroundColor: '#e67e22',
      borderColor: '#2c3e50',
      borderWidth: 1,
    }]
  };

  // Données pour le graphique en ligne (revenus mensuels)
  const monthlyRevenue = [12, 25, 18, 35, 42, 38, 50, 45, 52, 48, 55, 60];
  const revenueChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [{
      label: 'Revenu (DT)',
      data: monthlyRevenue,
      borderColor: '#27ae60',
      backgroundColor: 'rgba(39, 174, 96, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }]
  };

  // Données pour le tarif par catégorie
  const ratesChartData = {
    labels: ['0-1h', '1-2h', '2-5h', '5-12h', '12-24h', '24h+'],
    datasets: [{
      label: 'Tarif (DT)',
      data: Object.values(RATES),
      backgroundColor: ['#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#e74c3c', '#c0392b'],
      borderColor: '#2c3e50',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenue, {user?.name}!</h1>
        <p className="role-badge">{user?.role.toUpperCase()}</p>
      </div>

      <div className="dashboard-grid">
        {user?.role === 'admin' && (
          <>
            <div className="stat-card">
              <div className="stat-content">
                <h3>Places disponibles</h3>
                <p className="stat-number">{availableSpots}</p>
                <small>sur {parkingSpots.length}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Places occupées</h3>
                <p className="stat-number">{occupiedSpots}</p>
                <small>Taux: {Math.round((occupiedSpots / parkingSpots.length) * 100)}%</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Revenu total</h3>
                <p className="stat-number">{getTotalRevenue()} DT</p>
                <small>{payments.length} paiements</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Véhicules actifs</h3>
                <p className="stat-number">{vehicles.length}</p>
                <small>actuellement stationnés</small>
              </div>
            </div>
          </>
        )}

        {user?.role === 'employee' && (
          <>
            <div className="stat-card">
              <div className="stat-content">
                <h3>Places disponibles</h3>
                <p className="stat-number">{availableSpots}</p>
                <small>sur {parkingSpots.length}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Places occupées</h3>
                <p className="stat-number">{occupiedSpots}</p>
                <small>Taux: {Math.round((occupiedSpots / parkingSpots.length) * 100)}%</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Véhicules actifs</h3>
                <p className="stat-number">{vehicles.length}</p>
                <small>actuellement stationnés</small>
              </div>
            </div>
          </>
        )}

        {user?.role === 'user' && (
          <>
            <div className="stat-card">
              <div className="stat-content">
                <h3>Places disponibles</h3>
                <p className="stat-number">{availableSpots}</p>
                <small>sur {parkingSpots.length}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3>Véhicules actifs</h3>
                <p className="stat-number">{vehicles.length}</p>
                <small>actuellement stationnés</small>
              </div>
            </div>
          </>
        )}
      </div>

      {(user?.role === 'admin' || user?.role === 'employee') && (
        <div className="charts-section">
          <h2>Statistiques et Graphiques</h2>
          
          <div className="charts-grid">
            <div className="chart-container">
              <h3>État des Places de Parking</h3>
              <Pie data={parkingChartData} options={pieOptions} />
            </div>

            <div className="chart-container">
              <h3>Véhicules par Étage</h3>
              <Bar data={vehiclesChartData} options={chartOptions} />
            </div>

            <div className="chart-container chart-full">
              <h3>Revenu Mensuel (DT)</h3>
              <Line data={revenueChartData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Tarification par Catégorie</h3>
              <Bar data={ratesChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      <div className="welcome-message">
        <h2>Accueil sur le Système de Gestion de Parking</h2>
        <p>Utilisez le menu de gauche pour naviguer vers les différentes sections de l'application.</p>
      </div>
    </div>
  );
};

export default Dashboard;
