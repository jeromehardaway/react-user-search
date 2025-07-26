import { useEffect, useState } from 'react';
import type { User } from '../types/User.js';
import { sortUsersByLastName } from '../utils/userUtils.js';
import { useApiCache } from './useApiCache.js';

const USERS_CACHE_KEY = 'users_data';
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getCachedData, setCachedData, isStale } = useApiCache();

  useEffect(() => {
    const fetchUsers = async () => {
      const cachedUsers = getCachedData<User[]>(USERS_CACHE_KEY);
      
      if (cachedUsers) {
        setUsers(cachedUsers);
        
        if (isStale) {
          fetchFreshData();
        }
        return;
      }
      fetchFreshData();
    };

    const fetchFreshData = async (retries = 3, delay = 1000) => {
      setLoading(true);
      try {
        const res = await fetch(USERS_API_URL);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error ${res.status}: ${errorText || res.statusText}`);
        }
        
        const data = await res.json();
        const sortedUsers = sortUsersByLastName(data);
        
        setUsers(sortedUsers);
        setCachedData(USERS_CACHE_KEY, sortedUsers);
        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching users:', error);
        
        const err = error as Error;

        if (retries > 0 && (error instanceof TypeError || (err.message && err.message.includes('Network')))) {
          console.log(`Retrying... (${retries} attempts left)`);
          setTimeout(() => {
            fetchFreshData(retries - 1, delay * 1.5);
          }, delay);
          return;
        }
        
        setError(err.message || 'Failed to fetch users');

        if (users.length === 0) {
          setUsers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getCachedData, isStale, setCachedData, users.length]);

  return { users, error, loading };
}