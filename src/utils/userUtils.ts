import type { User } from '../types/User';

/**
 * Formats a user's name according to the required format: "{Last Name} {Suffix}, {First Name} (Title)"
 * 
 * Examples:
 * - "Jane Doe" => "Doe, Jane"
 * - "Mr. John Doe Jr." => "Doe Jr., John (Mr.)"
 * - "Mr. James Von Doe III" => "Von Doe III, James (Mr.)"
 * 
 * @param name - The name to format
 * @returns The formatted name
 */
export const formatUserName = (name: string | null | undefined): string => {
  // Handle empty, null, or undefined inputs
  if (!name || name.trim() === '') {
    return '';
  }

  // Extract title (Mr., Mrs., etc.)
  let title = '';
  let remainingName = name;
  const titleMatch = name.match(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)(\s+)/);
  
  if (titleMatch) {
    title = titleMatch[1];
    remainingName = name.substring(titleMatch[0].length);
  }

  // Split the remaining name into parts
  const nameParts = remainingName.trim().split(/\s+/);
  
  // If only one word, return the original name
  if (nameParts.length < 2) {
    return name;
  }

  // Extract first name (assuming it's the first part)
  const firstName = nameParts[0];
  
  // Check if the last part is a suffix
  const lastPart = nameParts[nameParts.length - 1];
  const suffixRegex = /^(Jr\.|Sr\.|I|II|III|IV|V)$/i;
  const isSuffix = suffixRegex.test(lastPart);
  
  let lastName;
  let suffix = '';
  
  if (isSuffix) {
    // If the last part is a suffix, extract it
    suffix = lastPart;
    // Last name is everything except first name and suffix
    lastName = nameParts.slice(1, nameParts.length - 1).join(' ');
  } else {
    // If no suffix, last name is everything except first name
    lastName = nameParts.slice(1).join(' ');
  }
  
  // Format according to requirements
  let formattedName = '';
  
  if (suffix) {
    formattedName = `${lastName} ${suffix}, ${firstName}`;
  } else {
    formattedName = `${lastName}, ${firstName}`;
  }
  
  if (title) {
    formattedName += ` (${title})`;
  }
  
  return formattedName;
};

/**
 * Formats a user object's name for display
 * 
 * @param user - The user object containing a name property
 * @returns The formatted name
 */
export const formatUserDisplay = (user: User): string => {
  return formatUserName(user.name);
};

/**
 * Sorts an array of users alphabetically by last name
 * 
 * @param users - The array of users to sort
 * @returns A new sorted array of users
 */
export const sortUsersByLastName = (users: User[]): User[] => {
  return [...users].sort((a, b) => {
    const aFormatted = formatUserName(a.name);
    const bFormatted = formatUserName(b.name);
    
    const aLastName = aFormatted.split(',')[0];
    const bLastName = bFormatted.split(',')[0];
    
    return aLastName.localeCompare(bLastName);
  });
};

/**
 * Gets the initials from a name
 * 
 * @param name - The name to extract initials from
 * @returns The initials in uppercase
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
};

/**
 * Generates a consistent color based on a string
 * 
 * @param str - The string to generate a color from
 * @returns A CSS HSL color string
 */
export const getColorFromString = (str: string): string => {
  if (!str) return 'hsl(0, 60%, 60%)';
  
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 60%)`;
};