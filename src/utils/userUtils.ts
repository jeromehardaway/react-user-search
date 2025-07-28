import type { User } from '../types/User.js';

export const formatUserName = (name: string | null | undefined): string => {
  if (!name || name.trim() === '') {
    return '';
  }

  let title = '';
  let remainingName = name;
  const titleMatch = name.match(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)(\s+)/);
  
  if (titleMatch) {
    title = titleMatch[1];
    remainingName = name.substring(titleMatch[0].length);
  }

  const nameParts = remainingName.trim().split(/\s+/);
  
  if (nameParts.length < 2) {
    return name;
  }

  const firstName = nameParts[0];
  
  const lastPart = nameParts[nameParts.length - 1];
  const suffixRegex = /^(Jr\.|Sr\.|I|II|III|IV|V)$/i;
  const isSuffix = suffixRegex.test(lastPart);
  
  let lastName;
  let suffix = '';
  
  if (isSuffix) {
    suffix = lastPart;
    lastName = nameParts.slice(1, nameParts.length - 1).join(' ');
  } else {
    lastName = nameParts.slice(1).join(' ');
  }
  
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
    const aFormatted = formatUserName(a.name);
    const bFormatted = formatUserName(b.name);
    
    const aLastName = aFormatted.split(',')[0];
    const bLastName = bFormatted.split(',')[0];
    
    return aLastName.localeCompare(bLastName);
  });
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
};

export const getColorFromString = (str: string, isDarkMode = false): string => {
  if (!str) return isDarkMode ? 'hsl(0, 60%, 45%)' : 'hsl(0, 60%, 60%)';
  
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = isDarkMode ? 65 : 60;
  const lightness = isDarkMode ? 45 : 60;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};