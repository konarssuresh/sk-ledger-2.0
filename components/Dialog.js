"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { AnimatePresence, motion as Motion } from "motion/react";
import { acquireBodyScrollLock } from "@/lib/bodyScrollLock";

const WIDTH_CLASS_MAP = {
  small: "max-w-sm",
  medium: "max-w-lg",
  large: "max-w-2xl",
  xlarge: "max-w-4xl",
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function Dialog({
  title,
  children,
  footer,
  onClose,
  onOpen,
  open = false,
  width = "medium",
  showHeader = true,
  closeOnBackdropClick = true,
  overlayClassName = "",
  panelClassName = "",
  bodyClassName = "",
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const isClosingRef = useRef(false);
  const [isVisible, setIsVisible] = useState(open);

  const widthClass = useMemo(
    () => WIDTH_CLASS_MAP[width] || WIDTH_CLASS_MAP.medium,
    [width],
  );

  useEffect(() => {
    if (!isVisible) return undefined;

    onOpen?.();
    lastFocusedRef.current = document.activeElement;
    const releaseBodyScrollLock = acquireBodyScrollLock();

    const setInitialFocus = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusableElements = panel.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        panel.focus();
      }
    };

    const timer = window.setTimeout(setInitialFocus, 0);

    const onKeyDown = (event) => {
      if (!isVisible || !panelRef.current) return;
      const dialogPanels = document.querySelectorAll(".app-dialog");
      const topMostDialog = dialogPanels[dialogPanels.length - 1];
      const isTopMost = topMostDialog === panelRef.current;
      if (!isTopMost) return;

      if (event.key === "Escape") {
        event.preventDefault();
        isClosingRef.current = true;
        setIsVisible(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements =
        panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      releaseBodyScrollLock();
      document.removeEventListener("keydown", onKeyDown);
      if (
        lastFocusedRef.current &&
        typeof lastFocusedRef.current.focus === "function"
      ) {
        lastFocusedRef.current.focus();
      }
    };
  }, [isVisible, onOpen]);

  useEffect(() => {
    // Sync exit animation visibility with the open prop (legacy dialog behavior).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional for AnimatePresence
    setIsVisible(open);
  }, [open]);

  if (!open && !isVisible) return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        if (isClosingRef.current) {
          isClosingRef.current = false;
          onClose?.();
        }
      }}
    >
      {isVisible ? (
        <Motion.div
          ref={overlayRef}
          className={clsx(
            "fixed inset-0 z-1000 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]",
            overlayClassName,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (closeOnBackdropClick && event.target === overlayRef.current) {
              isClosingRef.current = true;
              setIsVisible(false);
            }
          }}
        >
          <Motion.section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Dialog"}
            tabIndex={-1}
            className={clsx(
              "app-dialog w-full rounded-2xl border border-slate-200/70 bg-base-100 shadow-2xl outline-none",
              "max-h-[90vh] overflow-hidden",
              widthClass,
              panelClassName,
            )}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              mass: 0.8,
            }}
          >
            {showHeader ? (
              <header className="app-dialog-header flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
                <h3 className="app-dialog-title text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost rounded-lg"
                  onClick={() => {
                    isClosingRef.current = true;
                    setIsVisible(false);
                  }}
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </header>
            ) : null}

            <div
              className={clsx(
                "app-dialog-body max-h-[60vh] overflow-y-auto px-5 py-4 text-slate-700",
                bodyClassName,
              )}
            >
              {children}
            </div>

            {footer ? (
              <footer className="app-dialog-footer border-t border-slate-200/70 px-5 py-4">
                {footer}
              </footer>
            ) : null}
          </Motion.section>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
