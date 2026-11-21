import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "../ornament/Icon";

/**
 * A modal sheet built on the native <dialog>: focus moves in and is kept
 * inside, Escape closes it, the page behind becomes inert, and focus returns
 * to the button that opened it. Full screen on phones, a panel on desktop.
 */
export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      data-lenis-prevent=""
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      <div className="sheet-panel">
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-3">
          <h2 id={titleId} className="font-heading text-h3">
            {title}
          </h2>
          <button type="button" className="header-btn" onClick={onClose} aria-label={closeLabel}>
            <Icon name="close" />
          </button>
        </div>
        <div className="pt-5">{children}</div>
      </div>
    </dialog>
  );
}
