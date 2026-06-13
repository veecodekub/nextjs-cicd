import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home Page', () => {
  it('renders the welcome heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Welcome to Next\.js!/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<Home />);
    const description = screen.getByText('Updated cicd with env');
    expect(description).toBeInTheDocument();
  });

  it('renders the contact page link', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /View Contacts/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('has correct styling classes', () => {
    render(<Home />);
    const container = screen.getByRole('heading', { name: /Welcome to Next\.js!/i }).closest('div');
    expect(container).toHaveClass('flex', 'min-h-screen', 'flex-col');
  });
});
