const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.1.54:3000',
    'http://192.168.1.54:3001',
    'http://192.168.1.54:3002',
    'https://wizpay-backend.onrender.com',
    'https://wizpay-frontend.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

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
      url: 'http://localhost:8080/api/v1/orders',
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
      url: 'http://localhost:8080/api/v1/orders',
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

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Development server accessible at: http://localhost:${PORT}`);
  console.log(`Network accessible at: http://192.168.1.54:${PORT}`);
}); 