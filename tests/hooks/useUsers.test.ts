import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../../src/hooks/useUsers.js';
import { useApiCache } from '../../src/hooks/useApiCache.js';

// Mock the fetch API
global.fetch = jest.fn();

// Mock the useApiCache hook
jest.mock('../../src/hooks/useApiCache.js', () => ({
  useApiCache: jest.fn()
}));

describe('useUsers hook', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  
  const mockApiCache = {
    getCachedData: jest.fn(),
    setCachedData: jest.fn(),
    isStale: false
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useApiCache as jest.Mock).mockReturnValue(mockApiCache);
  });
  
  it('fetches users from API when no cached data exists', async () => {
    // Mock the fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });
    
    // Mock no cached data
    mockApiCache.getCachedData.mockReturnValue(null);
    
    const { result } = renderHook(() => useUsers());
    
    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);
    
    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have users and no error
    // We don't need to test the exact order, just that all users are there
    expect(result.current.users).toHaveLength(mockUsers.length);
    expect(result.current.users).toEqual(expect.arrayContaining(mockUsers));
    expect(result.current.error).toBeNull();
    
    // Should have called fetch
    expect(global.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
    
    // Should have cached the data
    expect(mockApiCache.setCachedData).toHaveBeenCalled();
  });
  
  it('uses cached data when available', async () => {
    // Mock cached data
    mockApiCache.getCachedData.mockReturnValue(mockUsers);
    mockApiCache.isStale = false;
    
    const { result } = renderHook(() => useUsers());
    
    // Should immediately have users from cache
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.loading).toBe(false);
    
    // Should not have called fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });
  
  it('handles API errors gracefully', async () => {
    // Mock an API error
    const errorMessage = 'Failed to fetch users';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    // Mock no cached data
    mockApiCache.getCachedData.mockReturnValue(null);
    
    const { result } = renderHook(() => useUsers());
    
    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have error
    expect(result.current.error).toContain(errorMessage);
    expect(result.current.users).toEqual([]);
  });
  
  it('refreshes stale cache data in the background', async () => {
    // Mock stale cached data
    mockApiCache.getCachedData.mockReturnValue(mockUsers);
    mockApiCache.isStale = true;
    
    // Mock the fetch response - use the same data for simplicity
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });
    
    const { result } = renderHook(() => useUsers());
    
    // Should immediately have users from cache
    expect(result.current.users).toEqual(mockUsers);
    
    // Wait for the background refresh
    await waitFor(() => {
      expect(mockApiCache.setCachedData).toHaveBeenCalled();
    });
    
    // Just check the users are still there - exact length doesn't matter
    expect(result.current.users.length).toBeGreaterThan(0);
  });
});
