import { formatUserName } from '../src/utils/userUtils.js';

describe('formatUserName', () => {
  const testCases = [
    {
      input: "Jane Doe",
      expected: "Doe, Jane"
    },
    {
      input: "Mr. John Doe Jr.",
      expected: "Doe Jr., John (Mr.)"
    },
    {
      input: "Mr. James Von Doe III",
      expected: "Von Doe III, James (Mr.)"
    },
    {
      input: "Dr. Elizabeth Smith-Johnson",
      expected: "Smith-Johnson, Elizabeth (Dr.)"
    },
    {
      input: "Prof. Robert O'Connor",
      expected: "O'Connor, Robert (Prof.)"
    }
  ];

  testCases.forEach((test) => {
    it(`correctly formats "${test.input}"`, () => {
      const result = formatUserName(test.input);
      expect(result).toBe(test.expected);
    });
  });
  
  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(formatUserName('')).toBe('');
    });
    
    it('handles null input', () => {
      expect(formatUserName(null)).toBe('');
    });
    
    it('handles undefined input', () => {
      expect(formatUserName(undefined)).toBe('');
    });
    
    it('handles single word name', () => {
      expect(formatUserName('John')).toEqual('John');
    });
  });
  
  // Test specific formatting requirements
  describe('specific formatting requirements', () => {
    it('correctly formats name with title', () => {
      expect(formatUserName('Dr. John Smith')).toBe('Smith, John (Dr.)');
    });
    
    it('correctly formats name with suffix', () => {
      expect(formatUserName('John Smith Jr.')).toBe('Smith Jr., John');
    });
    
    it('correctly formats name with compound last name', () => {
      expect(formatUserName('John van der Wal')).toBe('van der Wal, John');
    });
  });
});