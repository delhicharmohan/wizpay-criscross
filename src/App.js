import React, { useState } from 'react';
import './App.css';

// API configuration - using same server for both frontend and backend
const API_BASE_URL = '';

function App() {
  const [balance, setBalance] = useState(1000);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentURL, setPaymentURL] = useState('');
  const [payoutURL, setPayoutURL] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [transactionType, setTransactionType] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setTransactionType('deposit');
    const amount = parseFloat(depositAmount);

    try {
      const response = await fetch(`${API_BASE_URL}/api/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      console.log('Deposit Response:', data);
      setApiResponse(data);

      if (data.success) {
        setBalance(prevBalance => prevBalance + amount);
        setOrders(prevOrders => [...prevOrders, {
          merchantOrderID: data.orderId,
          amount,
          type: 'deposit',
          timestamp: new Date().toLocaleString()
        }]);

        const url = data.apiResponse?.data?.redirectURL;
        if (url) {
          setPaymentURL(url);
          setShowModal(true);
          window.open(url, '_blank');
        }
      } else {
        alert('Deposit failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during deposit:', error);
      alert('Failed to process deposit');
    } finally {
      setLoading(false);
      setDepositAmount('');
    }
  };

  const handleWithdrawal = async () => {
    setLoading(true);
    setTransactionType('withdraw');
    const amount = Math.floor(Math.random() * 9) + 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      console.log('Withdrawal Response:', data);
      setApiResponse(data);

      if (data.success) {
        setBalance(prevBalance => prevBalance - amount);
        setOrders(prevOrders => [...prevOrders, {
          merchantOrderID: data.orderId,
          amount,
          type: 'withdrawal',
          timestamp: new Date().toLocaleString()
        }]);

        const url = data.apiResponse?.data?.instantPayoutURL;
        if (url) {
          setPayoutURL(url);
          setShowModal(true);
          window.open(url, '_blank');
        }
      } else {
        alert('Withdrawal failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during withdrawal:', error);
      alert('Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const getActiveURL = () => {
    return transactionType === 'deposit' ? paymentURL : payoutURL;
  };

  return (
    <div className="wallet-container">
      <h1>My Wallet</h1>
      <div className="balance-card">
        <h2>Current Balance</h2>
        <div className="balance-amount">${balance}</div>
      </div>
      <div className="button-container">
        <div className="deposit-section">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            className="amount-input"
            min="1"
            step="1"
          />
          <button 
            className="deposit-btn" 
            onClick={handleDeposit}
            disabled={loading || !depositAmount}
          >
            {loading && transactionType === 'deposit' ? 'Processing...' : 'Deposit'}
          </button>
        </div>
        <button 
          className="withdraw-btn" 
          onClick={handleWithdrawal}
          disabled={loading}
        >
          {loading && transactionType === 'withdraw' ? 'Processing...' : `Withdraw $${Math.floor(Math.random() * 9) + 1}`}
        </button>
      </div>

      <div className="orders-section">
        <h2>Transaction History</h2>
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className={`transaction-type ${order.type}`}>
                {order.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </div>
              <div>Order ID: {order.merchantOrderID}</div>
              <div>Amount: ${order.amount}</div>
              <div>Time: {order.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for both deposit and withdrawal */}
      {showModal && getActiveURL() && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{transactionType === 'withdraw' ? 'Withdrawal' : 'Deposit'} URL</h2>
            <div className="payment-url-display">
              <p>URL has been opened in a new tab.</p>
              <p className="url-text">{getActiveURL()}</p>
              <button 
                className="payment-btn"
                onClick={() => window.open(getActiveURL(), '_blank')}
              >
                Open Again in New Tab
              </button>
            </div>
            <button className="close-modal" onClick={() => {
              setShowModal(false);
              setPaymentURL('');
              setPayoutURL('');
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Debug section */}
      <div className="debug-section">
        <h3>Debug Information</h3>
        <div>API Base URL: {API_BASE_URL}</div>
        <div>Transaction Type: {transactionType}</div>
        <div>Show Modal: {showModal.toString()}</div>
        <div>Payment URL: {paymentURL || 'Not set'}</div>
        <div>Payout URL: {payoutURL || 'Not set'}</div>
        <div>Latest Response:</div>
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
