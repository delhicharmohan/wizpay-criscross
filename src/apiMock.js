// apiMock.js

let walletData = null;
let transactionsData = [];
let balance = 0;

export const mockFetch = (url, options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = {};
      switch (url) {
        case '/api/create-wallet':
          walletData = { id: 'wallet-' + Date.now(), balance: balance };
          response = { wallet: walletData };
          break;
        case '/api/deposit':
          balance += 100;
          const depositTx = { type: 'Deposit', amount: 100 };
          transactionsData.push(depositTx);
          response = { transaction: depositTx, balance: balance };
          break;
        case '/api/withdraw':
          balance -= 50;
          const withdrawTx = { type: 'Withdrawal', amount: 50 };
          transactionsData.push(withdrawTx);
          response = { transaction: withdrawTx, balance: balance };
          break;
        case '/api/transactions':
          response = { transactions: transactionsData };
          break;
        default:
          response = {};
      }
      resolve({
        json: () => Promise.resolve(response),
      });
    }, 500);
  });
};
