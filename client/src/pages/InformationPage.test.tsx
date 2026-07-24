import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import InformationPage from './InformationPage.tsx';

describe('contact placeholder', () => {
  it('validates locally and clearly states that nothing was submitted', async () => {
    render(<MemoryRouter initialEntries={['/contact']}><InformationPage /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('Full name'), 'PlainB Customer');
    await userEvent.type(screen.getByLabelText('Email'), 'customer@example.com');
    await userEvent.type(screen.getByLabelText('Subject'), 'Product question');
    await userEvent.type(screen.getByLabelText('Message'), 'Please share more product information.');
    await userEvent.click(screen.getByRole('button', { name: 'Validate message' }));
    expect(await screen.findByText(/No information was sent or stored/i)).toBeInTheDocument();
  });
});
