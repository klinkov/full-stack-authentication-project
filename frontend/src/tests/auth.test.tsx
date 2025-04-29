import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Mock authStore with all required properties and methods
jest.mock('../store/authStore', () => ({
    login: jest.fn(),
    isAuthenticated: false, // Mock default authentication state
}));

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('submits login form successfully', async () => {
        const mockLogin = require('../store/authStore').login;
        mockLogin.mockResolvedValue(undefined);

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
        await userEvent.type(screen.getByPlaceholderText('Password'), 'password');
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });
});