import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Payment from './Payment';

describe('Payment Component', () => {
  test('renders payment form with all required fields', () => {
    render(<Payment />);
    
    expect(screen.getByText('Daily Payment Entry')).toBeInTheDocument();
    expect(screen.getByLabelText(/Meeting Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty form submission', () => {
    render(<Payment />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Meeting date is required')).toBeInTheDocument();
    expect(screen.getByText('Meeting type is required')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  test('handles form input changes correctly', () => {
    render(<Payment />);
    
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    const dateInput = screen.getByLabelText(/Meeting Date/i);
    fireEvent.change(dateInput, { target: { value: '2025-01-03' } });
    expect(dateInput.value).toBe('2025-01-03');
  });

  test('validates positive amount values', () => {
    render(<Payment />);
    
    const internInput = screen.getByLabelText(/Amount Paid by Intern/i);
    fireEvent.change(internInput, { target: { value: '-100' } });
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Amount Paid by Intern must be positive')).toBeInTheDocument();
  });
});
