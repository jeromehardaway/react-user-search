import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    
    fireEvent.change(input, { target: { value: 'John' } });
    
    // We need to wait because of debounce
    await waitFor(() => {
      expect(searchUsersMock).toHaveBeenCalledWith('John');
    });
  });
  
  it('displays user data when available', () => {
    // Mock specific implementation for this test
    (useUsers as jest.Mock).mockImplementation(() => ({
      users: mockUsers,
      loading: false,
      error: null,
      searchUsers: jest.fn(),
      selectedUser: mockUsers[0]
    }));
    
    render(<UserSearch />);
    
    // Since we're now showing the selected user, check for that user's name
    expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
  });
});
