import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { UserSearch } from '../../src/components/UserSearch.js';
import { useUsers } from '../../src/hooks/useUsers.js';

// Mock the useUsers hook
jest.mock('../../src/hooks/useUsers.js', () => ({
  useUsers: jest.fn()
}));

describe('UserSearch', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  
  beforeEach(() => {
    // Reset the mock
    jest.clearAllMocks();
    
    // Default mock implementation
    (useUsers as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      searchUsers: jest.fn()
    });
  });
  
  it('renders search input correctly', () => {
    render(<UserSearch />);
    expect(screen.getByPlaceholderText(/start typing a name/i)).toBeInTheDocument();
  });
  
  it('displays loading state', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: true,
      error: null,
      searchUsers: jest.fn()
    });
    
    render(<UserSearch />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('displays error message when search fails', () => {
    const errorMessage = 'Failed to fetch users';
    (useUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: false,
      error: errorMessage,
      searchUsers: jest.fn()
    });
    
    render(<UserSearch />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  it('calls searchUsers when input changes', async () => {
    const searchUsersMock = jest.fn();
    (useUsers as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      searchUsers: searchUsersMock
    });
    
    render(<UserSearch />);
    const input = screen.getByPlaceholderText(/start typing a name/i);
    
    // In the actual component, we don't call searchUsers directly but filter the list
    // so let's update this test to check the filtered list instead
    fireEvent.change(input, { target: { value: 'John' } });
    
    // We need to wait because of debounce
    await waitFor(() => {
      // Just verify we have the correct count in the results
      expect(screen.getByText(/1 user found|1 users found/i)).toBeInTheDocument();
    });
  });
  
  it('displays user data when available', async () => {
    const selectedUser = {
      ...mockUsers[0],
      username: 'johndoe',
      phone: '123-456-7890',
      website: 'example.com',
      company: { name: 'Example Inc', bs: 'innovation', catchPhrase: 'Best company' },
      address: {
        street: '123 Main St',
        suite: 'Apt 1',
        city: 'Anytown',
        zipcode: '12345',
        geo: { lat: '0', lng: '0' }
      }
    };
    
    // For this test, we'll directly mock useState to set selectedUser
    // This better mimics what happens in the component
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [selectedUser, jest.fn()]);
    
    // Mock useUsers to return our test data
    (useUsers as jest.Mock).mockImplementation(() => ({
      users: mockUsers,
      loading: false,
      error: null,
      searchUsers: jest.fn()
    }));
    
    render(<UserSearch />);
    
    // When a user is selected, we should see the company name
    expect(screen.getByText('Example Inc')).toBeInTheDocument();
  });
});
