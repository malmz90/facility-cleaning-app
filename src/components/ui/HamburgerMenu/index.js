"use client";

import { useId, useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";

/**
 * Reusable hamburger menu button + dropdown.
 *
 * `children` can be a React node or a render-prop function that receives a
 * `close` callback — useful when links inside the menu need to close it:
 *
 * @example
 * // Render prop (recommended when items navigate or take actions)
 * <HamburgerMenu ariaLabel="Öppna meny">
 *   {(close) => (
 *     <>
 *       <Link href="/foo" onClick={close}>Foo</Link>
 *       <button onClick={() => { doSomething(); close(); }}>Action</button>
 *     </>
 *   )}
 * </HamburgerMenu>
 *
 * @example
 * // Plain children (menu closes on outside click / Escape)
 * <HamburgerMenu ariaLabel="Öppna meny">
 *   <p>Static content</p>
 * </HamburgerMenu>
 */
export default function HamburgerMenu({ children, ariaLabel = "Öppna meny" }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef(null);

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        aria-label={isOpen ? "Stäng meny" : ariaLabel}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.icon} aria-hidden="true" />
      </button>

      <div
        id={menuId}
        role="menu"
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
      >
        {typeof children === "function" ? children(close) : children}
      </div>
    </div>
  );
}
