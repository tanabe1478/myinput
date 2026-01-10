import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render the application title', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('RSS Reader MVP');
  });

  it('should render the welcome message', () => {
    render(<App />);

    const message = screen.getByText(/Welcome to your RSS Reader/i);
    expect(message).toBeInTheDocument();
  });

  it('should mention the tech stack', () => {
    render(<App />);

    const techStack = screen.getByText(/GraphQL \+ React \+ Cloudflare Workers/i);
    expect(techStack).toBeInTheDocument();
  });

  it('should apply Tailwind CSS classes', () => {
    render(<App />);

    const container = screen.getByRole('heading', { level: 1 }).closest('div');
    expect(container).toHaveClass('container');
  });
});
