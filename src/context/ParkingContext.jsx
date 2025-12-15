import React, { createContext, useState, useContext } from 'react';

const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
  const [parkingSpots, setParkingSpots] = useState([
    { id: 1, spotNumber: 'A1', status: 'available', floor: 1, type: 'standard' },
    { id: 2, spotNumber: 'A2', status: 'occupied', floor: 1, type: 'standard' },
    { id: 3, spotNumber: 'A3', status: 'available', floor: 1, type: 'standard' },
    { id: 4, spotNumber: 'A4', status: 'available', floor: 1, type: 'handicap' },
    { id: 5, spotNumber: 'B1', status: 'occupied', floor: 2, type: 'standard' },
    { id: 6, spotNumber: 'B2', status: 'available', floor: 2, type: 'standard' },
    { id: 7, spotNumber: 'B3', status: 'available', floor: 2, type: 'reserved' },
    { id: 8, spotNumber: 'B4', status: 'occupied', floor: 2, type: 'standard' },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: 1, plate: 'ABC123', owner: 'Admin User', type: 'Voiture', entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), spotId: 2 },
    { id: 2, plate: 'DEF456', owner: 'Employee User', type: 'Moto', entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000), spotId: 5 },
  ]);

  const reserveSpot = (spotId, userId) => {
    setParkingSpots(spots =>
      spots.map(spot =>
        spot.id === spotId ? { ...spot, status: 'occupied', userId } : spot
      )
    );
  };

  const releaseSpot = (spotId) => {
    setParkingSpots(spots =>
      spots.map(spot =>
        spot.id === spotId ? { ...spot, status: 'available', userId: null } : spot
      )
    );
  };

  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: Date.now() }]);
  };

  const removeVehicle = (vehicleId) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
  };

  const addParkingSpot = (spotData) => {
    const newSpot = {
      id: Math.max(...parkingSpots.map(s => s.id), 0) + 1,
      spotNumber: spotData.spotNumber,
      status: 'available',
      floor: parseInt(spotData.floor),
      type: spotData.type
    };
    setParkingSpots([...parkingSpots, newSpot]);
  };

  const removeParkingSpot = (spotId) => {
    setParkingSpots(parkingSpots.filter(s => s.id !== spotId));
  };

  const value = {
    parkingSpots,
    vehicles,
    reserveSpot,
    releaseSpot,
    addVehicle,
    removeVehicle,
    addParkingSpot,
    removeParkingSpot
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
