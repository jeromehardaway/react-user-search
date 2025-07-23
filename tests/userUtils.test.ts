// Test cases for the userUtils.ts file
// This is just a simple test file to verify the formatUserName function works correctly
// You can execute these tests manually by looking at the output in the console

import { formatUserName } from '../src/utils/userUtils';

// Test cases
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

// Run tests
console.log("Running formatUserName tests...");
testCases.forEach((test, index) => {
  const result = formatUserName(test.input);
  const passed = result === test.expected;
  console.log(`Test ${index + 1}: ${passed ? "PASSED" : "FAILED"}`);
  if (!passed) {
    console.log(`  Input:    "${test.input}"`);
    console.log(`  Expected: "${test.expected}"`);
    console.log(`  Actual:   "${result}"`);
  }
});
