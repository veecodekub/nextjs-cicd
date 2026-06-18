import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HelloPage from '../../hello/page';

describe('Hello Page', () => {
  it('renders a name input and updates the greeting', () => {
    render(<HelloPage />);

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'Vee' } });

    expect(screen.getByRole('heading', { name: /hello, vee/i })).toBeInTheDocument();
    expect(screen.getByText('Hello, Vee!')).toBeInTheDocument();
  });

  it('renders the CI/CD release note', () => {
    render(<HelloPage />);

    expect(screen.getByText('CI/CD release note')).toBeInTheDocument();
    expect(
      screen.getByText('This page is ready for the GitOps promotion flow.'),
    ).toBeInTheDocument();
  });
});
