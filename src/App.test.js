import { render, screen } from '@testing-library/react';
import App from './App';

test('renders wallet application', () => {
  render(<App />);
  const titleElement = screen.getByText(/My Wallet/i);
  expect(titleElement).toBeInTheDocument();
});
