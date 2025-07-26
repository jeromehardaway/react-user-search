import { useEffect, useRef, KeyboardEvent } from 'react';

interface KeyboardNavigableListProps {
  children: React.ReactNode;
  listId: string;
  onKeyDown?: (event: KeyboardEvent) => void;
  onItemSelect?: (index: number) => void;
  selectedIndex?: number;
  itemCount: number;
  itemSelector: string;
}

export const KeyboardNavigableList = ({
  children,
  listId,
  onKeyDown,
  onItemSelect,
  selectedIndex = -1,
  itemCount,
  itemSelector,
}: KeyboardNavigableListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to selected item when selection changes
    if (selectedIndex >= 0 && containerRef.current) {
      const container = containerRef.current;
      const items = Array.from(container.querySelectorAll(itemSelector));
      
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex, itemSelector]);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Call custom handler if provided
    if (onKeyDown) {
      onKeyDown(e);
    }

    // Handle keyboard navigation
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (onItemSelect && selectedIndex < itemCount - 1) {
          onItemSelect(selectedIndex + 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (onItemSelect && selectedIndex > 0) {
          onItemSelect(selectedIndex - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (onItemSelect && itemCount > 0) {
          onItemSelect(0);
        }
        break;
      case 'End':
        e.preventDefault();
        if (onItemSelect && itemCount > 0) {
          onItemSelect(itemCount - 1);
        }
        break;
      case 'Enter':
      case ' ':
        if (selectedIndex >= 0 && onItemSelect) {
          e.preventDefault();
          onItemSelect(selectedIndex);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      id={listId}
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-activedescendant={selectedIndex >= 0 ? `${listId}-item-${selectedIndex}` : undefined}
      aria-label="Navigable list"
    >
      {children}
    </div>
  );
};
