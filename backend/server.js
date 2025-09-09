const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.15.130:3000',
    'http://192.168.15.130:3001',
    'http://192.168.15.130:3002',
    'https://wizpay-criscross-1.onrender.com',
    'https://wizpay-backend.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'static')));

const generateHash = (plainText) => {
  const secretKey = 's23e4567e89b12d3a45642661417400s';
  return crypto
    .createHmac('sha256', secretKey)
    .update(plainText)
    .digest('base64');
};

app.post('/api/deposit', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const payload = {
      customerName: "am3009",
      customerIp: "0.0.0.1",
      customerMobile: "9587414520",
      customerUPIID: "",
      merchantOrderID: crypto.randomUUID(),
      amount,
      mode: "UPI",
      type: "payin",
      clientName: "",
      paymentStatus: "",
      returnUrl: "https://www.example.com",
      website: "speed"
    };

    const hash = generateHash(JSON.stringify(payload));

    const response = await axios({
      method: 'post',
      url: 'https://wizpay-backend.onrender.com/api/v1/orders',
      headers: {
        'Content-Type': 'application/json',
        'x-key': '550e8400e29b41d4a716446655440000',
        'x-hash': hash,
        'vendor': 'gocomart'
      },
      data: payload
    });

    console.log('API Response Structure:', JSON.stringify(response.data, null, 2));

    res.json({
      success: true,
      orderId: payload.merchantOrderID,
      apiResponse: response.data,
      message: 'API Response received'
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Internal server error' 
    });
  }
});

app.post('/api/withdraw', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const payload = {
      customerName: "am3009",
      customerIp: "0.0.0.1",
      customerMobile: "4587414520",
      customerUPIID: "",
      merchantOrderID: `payout-${crypto.randomUUID()}`,
      amount,
      mode: "UPI",
      type: "payout",
      clientName: "",
      paymentStatus: "",
      returnUrl: "https://www.example.com",
      accountNumber: "21370100025842",
      ifsc: "FDRL0002137",
      bankName: "The Federal Bank",
      payoutType: "instant"
    };

    const hash = generateHash(JSON.stringify(payload));

    const response = await axios({
      method: 'post',
      url: 'https://wizpay-backend.onrender.com/api/v1/orders',
      headers: {
        'Content-Type': 'application/json',
        'x-key': '550e8400e29b41d4a716446655440000',
        'x-hash': hash,
        'vendor': 'gocomart'
      },
      data: payload
    });

    console.log('Withdrawal Response:', response.data);

    res.json({
      success: true,
      orderId: payload.merchantOrderID,
      apiResponse: response.data,
      message: 'Withdrawal request received'
    });
  } catch (error) {
    console.error('Withdrawal Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Internal server error' 
    });
  }
});

app.get('/api/claim-urls', async (req, res) => {
  try {
    const payload = {};
    const hash = generateHash(JSON.stringify(payload));

    const response = await axios({
      method: 'get',
      url: 'https://wizpay-backend.onrender.com/api/v1/orders/instant-payout/available',
      headers: {
        'Content-Type': 'application/json',
        'x-key': '550e8400e29b41d4a716446655440000',
        'x-hash': hash,
        'vendor': 'gocomart'
      },
      data: payload
    });

    console.log('Claim URLs Response:', response.data);

    res.json({
      success: true,
      data: response.data,
      message: 'Claim URLs fetched successfully'
    });
  } catch (error) {
    console.error('Claim URLs Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Internal server error' 
    });
  }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Development server accessible at: http://localhost:${PORT}`);
  console.log(`Network accessible at: http://192.168.15.130:${PORT}`);
}); 