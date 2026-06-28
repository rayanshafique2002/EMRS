import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders login screen', () => {
  const { getByRole } = render(<App />);
  expect(getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
});
