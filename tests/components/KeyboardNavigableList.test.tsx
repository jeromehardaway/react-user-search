import { render, screen, fireEvent } from '@testing-library/react';
import { KeyboardNavigableList } from '../../src/components/KeyboardNavigableList.js';

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('KeyboardNavigableList', () => {
  const mockOnItemSelect = jest.fn();
  
  beforeEach(() => {
    mockOnItemSelect.mockClear();
    (Element.prototype.scrollIntoView as jest.Mock).mockClear();
  });

  it('renders children correctly', () => {
    render(
      <KeyboardNavigableList 
        listId="test-list" 
        itemCount={3} 
        itemSelector=".list-item"
      >
        <div key="item1" className="list-item">Item 1</div>
        <div key="item2" className="list-item">Item 2</div>
        <div key="item3" className="list-item">Item 3</div>
      </KeyboardNavigableList>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <KeyboardNavigableList 
        listId="test-list" 
        itemCount={3} 
        itemSelector=".list-item"
        selectedIndex={0}
        onItemSelect={mockOnItemSelect}
      >
        <div key="item1" className="list-item">Item 1</div>
        <div key="item2" className="list-item">Item 2</div>
        <div key="item3" className="list-item">Item 3</div>
      </KeyboardNavigableList>
    );
    
    const list = screen.getByTestId('test-list');
    
    // Down arrow should select next item
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(mockOnItemSelect).toHaveBeenCalledWith(1);
    
    // Up arrow should select previous item
    mockOnItemSelect.mockReset();
    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(mockOnItemSelect).not.toHaveBeenCalled(); // Already at first item
    
    // Home key should select first item
    mockOnItemSelect.mockReset();
    fireEvent.keyDown(list, { key: 'Home' });
    expect(mockOnItemSelect).toHaveBeenCalledWith(0);
    
    // End key should select last item
    mockOnItemSelect.mockReset();
    fireEvent.keyDown(list, { key: 'End' });
    expect(mockOnItemSelect).toHaveBeenCalledWith(2);
    
    // Enter should select current item
    mockOnItemSelect.mockReset();
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(mockOnItemSelect).toHaveBeenCalledWith(0);
  });

  it('calls custom onKeyDown handler when provided', () => {
    const mockOnKeyDown = jest.fn();
    
    render(
      <KeyboardNavigableList 
        listId="test-list" 
        itemCount={3} 
        itemSelector=".list-item"
        onKeyDown={mockOnKeyDown}
      >
        <div key="item1" className="list-item">Item 1</div>
        <div key="item2" className="list-item">Item 2</div>
        <div key="item3" className="list-item">Item 3</div>
      </KeyboardNavigableList>
    );
    
    const list = screen.getByTestId('test-list');
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    
    expect(mockOnKeyDown).toHaveBeenCalled();
  });
});
