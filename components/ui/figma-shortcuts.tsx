"use client";

import { useEffect, useCallback } from 'react';

interface FigmaShortcutsProps {
  onToolChange: (toolId: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

export const FigmaShortcuts: React.FC<FigmaShortcutsProps> = ({
  onToolChange,
  onDelete,
  onDuplicate,
  onUndo,
  onRedo,
  onSave
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const isModKey = ctrlKey || metaKey;

    // Prevent default behavior for our shortcuts
    const shortcuts = [
      'v', 'r', 'o', 't', 'h', 's', // Tools
      'Delete', 'Backspace', // Delete
      'z', 'y', // Undo/Redo
      'd', // Duplicate
      'a', // Select all
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight' // Movement
    ];

    if (shortcuts.includes(key.toLowerCase()) || (isModKey && ['z', 'y', 'd', 's', 'a'].includes(key.toLowerCase()))) {
      // Only prevent default if we're not in an input field
      const target = event.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      } else {
        return; // Don't handle shortcuts when typing in inputs
      }
    }

    // Tool shortcuts (only when not holding modifier keys)
    if (!isModKey && !shiftKey && !altKey) {
      switch (key.toLowerCase()) {
        case 'v':
          onToolChange('select');
          break;
        case 'r':
          onToolChange('rectangle');
          break;
        case 'o':
          onToolChange('circle');
          break;
        case 't':
          onToolChange('text');
          break;
        case 'h':
          onToolChange('hand');
          break;
        case 's':
          onToolChange('seat');
          break;
        case 'delete':
        case 'backspace':
          onDelete();
          break;
        case 'escape':
          // Deselect all or cancel current operation
          onToolChange('select');
          break;
      }
    }

    // Modifier key shortcuts
    if (isModKey) {
      switch (key.toLowerCase()) {
        case 'z':
          if (shiftKey) {
            onRedo();
          } else {
            onUndo();
          }
          break;
        case 'y':
          onRedo();
          break;
        case 'd':
          onDuplicate();
          break;
        case 's':
          onSave();
          break;
        case 'a':
          // Select all - would need to be implemented in parent
          console.log('Select all shortcut');
          break;
      }
    }

    // Arrow key shortcuts for nudging selected elements
    if (!isModKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const nudgeAmount = shiftKey ? 10 : 1; // Shift for larger nudges
      
      switch (key) {
        case 'ArrowUp':
          console.log(`Nudge up by ${nudgeAmount}`);
          break;
        case 'ArrowDown':
          console.log(`Nudge down by ${nudgeAmount}`);
          break;
        case 'ArrowLeft':
          console.log(`Nudge left by ${nudgeAmount}`);
          break;
        case 'ArrowRight':
          console.log(`Nudge right by ${nudgeAmount}`);
          break;
      }
    }

    // Number key shortcuts for opacity (1-9, 0 for 100%)
    if (!isModKey && !shiftKey && !altKey) {
      const num = parseInt(key);
      if (!isNaN(num)) {
        const opacity = num === 0 ? 100 : num * 10;
        console.log(`Set opacity to ${opacity}%`);
      }
    }

  }, [onToolChange, onDelete, onDuplicate, onUndo, onRedo, onSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // This component doesn't render anything, it just handles keyboard events
  return null;
};