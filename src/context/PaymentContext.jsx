import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([
    { id: 1, vehicleId: 1, amount: 15, method: 'carte', duration: 2, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'paid' },
    { id: 2, vehicleId: 2, amount: 8, method: 'espece', duration: 1, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'paid' },
  ]);

  const RATES = {
    0.5: 3,    // 30 min = 3 DT
    1: 5,      // 1 heure = 5 DT
    2: 10,     // 2 heures = 10 DT
    4: 15,     // 4 heures = 15 DT
    8: 25,     // 8 heures = 25 DT
    24: 40     // 24 heures = 40 DT
  };

  const calculatePrice = (duration) => {
    if (duration <= 0.5) return RATES[0.5];
    if (duration <= 1) return RATES[1];
    if (duration <= 2) return RATES[2];
    if (duration <= 4) return RATES[4];
    if (duration <= 8) return RATES[8];
    return RATES[24];
  };

  const addPayment = (paymentData) => {
    const newPayment = {
      id: Date.now(),
      ...paymentData,
      amount: calculatePrice(paymentData.duration),
      date: new Date(),
      status: 'paid'
    };
    setPayments([...payments, newPayment]);
    return newPayment;
  };

  const getPaymentHistory = (vehicleId) => {
    return payments.filter(p => p.vehicleId === vehicleId);
  };

  const getTotalRevenue = () => {
    return payments.reduce((total, p) => total + p.amount, 0);
  };

  const value = {
    payments,
    RATES,
    calculatePrice,
    addPayment,
    getPaymentHistory,
    getTotalRevenue
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
