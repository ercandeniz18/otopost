import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

const TestComponent = () => {
  const { user, login, logout, updateProfile, isLoading, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No User'}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <button onClick={() => login('admin@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateProfile({ name: 'Updated Name' })}>Update Profile</button>
    </div>
  );
};

const renderWithAuthProvider = (component: ReactNode) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have no user initially', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('No User');
      });
    });

    it('should not be authenticated initially', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('false');
      });
    });

    it('should load user from localStorage if available', async () => {
      const mockUser = {
        id: '1',
        name: 'Stored User',
        email: 'stored@example.com',
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('Stored User');
      });
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('Admin User');
      });
    });

    it('should set authenticated to true after login', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true');
      });
    });

    it('should store user in localStorage after login', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        const storedUser = localStorage.getItem('user');
        expect(storedUser).toBeTruthy();
        expect(JSON.parse(storedUser!).name).toBe('Admin User');
      });
    });

    it('should throw error for invalid credentials', async () => {
      const TestComponentWithError = () => {
        const { login } = useAuth();
        return (
          <button onClick={() => login('wrong@example.com', 'wrong')}>Login</button>
        );
      };
      
      renderWithAuthProvider(<TestComponentWithError />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await expect(login('wrong@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout and clear user', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('Admin User');
      });
      
      await waitFor(() => {
        screen.getByText('Logout').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('No User');
      });
    });

    it('should remove user from localStorage after logout', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        screen.getByText('Logout').click();
      });
      
      await waitFor(() => {
        expect(localStorage.getItem('user')).toBeNull();
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        screen.getByText('Update Profile').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('Updated Name');
      });
    });

    it('should persist updated profile to localStorage', async () => {
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        screen.getByText('Login').click();
      });
      
      await waitFor(() => {
        screen.getByText('Update Profile').click();
      });
      
      await waitFor(() => {
        const storedUser = localStorage.getItem('user');
        expect(JSON.parse(storedUser!).name).toBe('Updated Name');
      });
    });

    it('should throw error when updating profile without logged in user', async () => {
      const TestComponentUpdateOnly = () => {
        const { updateProfile } = useAuth();
        return (
          <button onClick={() => updateProfile({ name: 'New Name' })}>Update</button>
        );
      };
      
      renderWithAuthProvider(<TestComponentUpdateOnly />);
      
      await expect(updateProfile({ name: 'New Name' })).rejects.toThrow('No user logged in');
    });
  });
});
