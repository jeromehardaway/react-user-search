import { render, screen } from '@testing-library/react';
import { VirtualList } from '../../src/components/VirtualList.js';

describe('VirtualList', () => {
  type TestItem = { id: number; name: string };
  
  const items = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    name: `Item ${index}`
  }));
  
  const renderItem = (item: TestItem) => (
    <div key={item.id} data-testid={`item-${item.id}`}>{item.name}</div>
  );
  
  it('renders initial visible items correctly', () => {
    render(
      <VirtualList<TestItem>
        items={items}
        height={300}
        width="100%"
        itemHeight={50}
        renderItem={renderItem}
      />
    );
    
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
  
  it('renders empty state when no items are provided', () => {
    render(
      <VirtualList<TestItem>
        items={[]}
        height={300}
        width="100%"
        itemHeight={50}
        renderItem={renderItem}
      />
    );
    
    const container = screen.getByTestId('virtual-list-container');
    expect(container).toBeInTheDocument();
  });
  
  it('applies custom styles when provided', () => {
    render(
      <VirtualList<TestItem>
        items={items}
        height={300}
        width="100%"
        itemHeight={50}
        renderItem={renderItem}
        overscan={10}
      />
    );
    
    const container = screen.getByTestId('virtual-list-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle({ height: '300px' });
  });
});
