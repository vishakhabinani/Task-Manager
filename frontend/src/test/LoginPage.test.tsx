import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import { expect, test } from 'vitest';

test('renders login page title', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthProvider>
  );
  
  const titleElement = screen.getByText(/TaskManager/i);
  expect(titleElement).toBeDefined();
});
