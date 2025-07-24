import type { User } from '../types/User';

export const formatUserName = (name: string): string => {
  // Check if name is empty
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
  
  if (nameParts.length < 2) {
    return name; // Return original if can't parse properly
  }

  // Extract first name (assuming it's the first part)
  const firstName = nameParts[0];
  
  // Last part is either a suffix or part of the last name
  const lastPart = nameParts[nameParts.length - 1];
  const suffixRegex = /^(Jr\.|Sr\.|I|II|III|IV|V)$/i;
  const isSuffix = suffixRegex.test(lastPart);
  
  let lastName;
  let suffix = '';
  
  if (isSuffix) {
    // If the last part is a suffix, the last name is everything except the first name and suffix
    suffix = lastPart;
    lastName = nameParts.slice(1, nameParts.length - 1).join(' ');
  } else {
    // If no suffix, the last name is everything except the first name
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

export const formatUserDisplay = (user: User): string => {
  return formatUserName(user.name);
};

export const sortUsersByLastName = (users: User[]): User[] => {
  return [...users].sort((a, b) => {
    // Extract last names for comparison
    const aFormatted = formatUserName(a.name);
    const bFormatted = formatUserName(b.name);
    
    // Get the last name part (before the comma)
    const aLastName = aFormatted.split(',')[0];
    const bLastName = bFormatted.split(',')[0];
    
    return aLastName.localeCompare(bLastName);
  });
};
