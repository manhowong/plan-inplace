import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from './utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * --------------------------------------------------------------------------
 * Component: Modal
 * --------------------------------------------------------------------------
 * A high-density modal component powered by the native HTML <dialog> API.
 * Provides built-in focus trapping and 'Esc' key handling.
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  footer,
  className 
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync native dialog state with React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }
  }, [isOpen]);

  // Handle 'Escape' key triggered by the browser
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={(e) => {
        // Close if clicking the backdrop (outside the main content)
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "fixed inset-0 z-50 bg-bg rounded-md shadow-2xl overflow-hidden flex-col max-h-[90vh] border border-border p-0 m-auto backdrop:bg-black/60 open:flex",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex flex-col">
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
          {description && (
            <p className="text-[13px] text-text-primary font-medium">
              {description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-accent/10 hover:text-accent"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-text-secondary/20">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-border">
          {footer}
        </div>
      )}
    </dialog>
  );
}
