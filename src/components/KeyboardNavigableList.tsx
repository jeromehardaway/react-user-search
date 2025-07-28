import { useEffect, useRef, KeyboardEvent, cloneElement } from 'react';

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
    if (onKeyDown) {
      onKeyDown(e);
    }

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
      data-testid={listId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {Array.isArray(children)
        ? children.map((child, idx) =>
            child && typeof child === 'object' && 'props' in child
              ? (
                  cloneElement(child, {
                    id: child.props?.id || `${listId}-item-${idx}`,
                    'data-selected': selectedIndex === idx,
                  })
                )
              : child
          )
        : children}
    </div>
  );
};
