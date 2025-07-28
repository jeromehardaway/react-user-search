import { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  width: string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  width,
  renderItem,
  overscan = 5,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(height / itemHeight) + 2 * overscan;
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount);
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  const totalHeight = items.length * itemHeight;
  
  const offsetY = startIndex * itemHeight;
  
  return (
    <Box
      ref={containerRef}
      data-testid="virtual-list-container"
      sx={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box sx={{ height: totalHeight, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            <Box key={startIndex + index} sx={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
