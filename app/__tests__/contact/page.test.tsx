import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactPage from '../../contact/page';

describe('Contact Page', () => {
  it('renders the page title', () => {
    render(<ContactPage />);
    const heading = screen.getByRole('heading', { name: /Contact Directory/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<ContactPage />);
    const description = screen.getByText('Connect with our team members');
    expect(description).toBeInTheDocument();
  });

  it('renders all contact cards', () => {
    render(<ContactPage />);
    const contacts = screen.getAllByRole('heading', { level: 3 });
    expect(contacts).toHaveLength(5);
  });

  it('displays contact names correctly', () => {
    render(<ContactPage />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    expect(screen.getByText('Emma Davis')).toBeInTheDocument();
    expect(screen.getByText('James Wilson')).toBeInTheDocument();
    expect(screen.getByText('Lisa Anderson')).toBeInTheDocument();
  });

  it('displays contact roles correctly', () => {
    render(<ContactPage />);
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('UX Designer')).toBeInTheDocument();
  });

  it('displays contact email links', () => {
    render(<ContactPage />);
    const emailLinks = screen.getAllByRole('link', { name: /@example\.com/ });
    expect(emailLinks.length).toBeGreaterThan(0);
  });

  it('displays contact phone links', () => {
    render(<ContactPage />);
    const phoneLinks = screen.getAllByRole('link', { name: /\(\d+\)/ });
    expect(phoneLinks.length).toBeGreaterThan(0);
  });

  it('email links have correct href attribute', () => {
    render(<ContactPage />);
    const emailLink = screen.getByRole('link', { name: /sarah\.johnson@example\.com/ });
    expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@example.com');
  });

  it('phone links have correct href attribute', () => {
    render(<ContactPage />);
    const phoneLink = screen.getByRole('link', { name: /\+1 \(555\) 123-4567/ });
    expect(phoneLink).toHaveAttribute('href', 'tel:+1 (555) 123-4567');
  });
});
