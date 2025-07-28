import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../src/hooks/useDebounce.js';

// Mock timers
jest.useFakeTimers();

describe('useDebounce hook', () => {
  it('returns the initial value immediately', () => {
    const initialValue = 'test';
    const { result } = renderHook(() => useDebounce(initialValue, 300));
    
    expect(result.current).toBe(initialValue);
  });
  
  it('delays updating the value until the delay has passed', () => {
    const initialValue = 'test';
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 300 } }
    );
    
    // Initial value is returned immediately
    expect(result.current).toBe(initialValue);
    
    // Update the value
    const newValue = 'updated';
    rerender({ value: newValue, delay: 300 });
    
    // Value should not have changed yet
    expect(result.current).toBe(initialValue);
    
    // Fast-forward time by 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Value should still not have changed
    expect(result.current).toBe(initialValue);
    
    // Fast-forward time to just before the threshold
    act(() => {
      jest.advanceTimersByTime(199);
    });
    
    // Value should still not have changed
    expect(result.current).toBe(initialValue);
    
    // Fast-forward time past the threshold
    act(() => {
      jest.advanceTimersByTime(1);
    });
    
    // Now the value should have updated
    expect(result.current).toBe(newValue);
  });
  
  it('uses the new delay if it changes', () => {
    const initialValue = 'test';
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 300 } }
    );
    
    // Update the value and decrease the delay
    const newValue = 'updated';
    rerender({ value: newValue, delay: 100 });
    
    // Fast-forward time by 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Value should have changed with the shorter delay
    expect(result.current).toBe(newValue);
  });
  
  it('cancels previous timeouts if the value changes before delay', () => {
    const initialValue = 'test';
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 300 } }
    );
    
    // Update the value
    rerender({ value: 'intermediate', delay: 300 });
    
    // Fast-forward time partially
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Update the value again before the first delay completes
    const finalValue = 'final';
    rerender({ value: finalValue, delay: 300 });
    
    // Fast-forward time by the delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Value should be the final one, not the intermediate
    expect(result.current).toBe(finalValue);
  });
});
