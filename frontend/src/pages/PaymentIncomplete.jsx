import React from 'react';
import { Link } from 'react-router-dom';

const PaymentIncomplete = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Payment Incomplete</h1>
      <p className="mb-4">
        Your payment was not completed successfully. This could be due to insufficient funds,
        a temporary issue with your payment method, or an interrupted connection.
      </p>
      <p className="mb-4">
        Please try again or use a different payment method. If you continue to experience issues,
        please contact our support team.
      </p>
      <Link to="/checkout" className="bg-blue-500 text-white px-4 py-2 rounded">
        Try Again
      </Link>
    </div>
  );
};

export default PaymentIncomplete;