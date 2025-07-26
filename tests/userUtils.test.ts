import { formatUserName } from '../src/utils/userUtils';

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
  
  // Add some edge cases
  it('handles empty string', () => {
    expect(formatUserName('')).toBe('');
  });
  
  it('handles null input', () => {
    // @ts-ignore - Testing null input even though types don't allow it
    expect(formatUserName(null)).toBe('');
  });
  
  it('handles undefined input', () => {
    // @ts-ignore - Testing undefined input even though types don't allow it
    expect(formatUserName(undefined)).toBe('');
  });
});