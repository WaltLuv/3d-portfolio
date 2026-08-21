import { useEffect, useRef, useState } from "react";

import { navLinks } from "../constants";

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeMenu = (restoreFocus = false) => {
      setMenuOpen(false);
      if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    const handleKeyboard = (event) => {
      if (event.key === "Escape") closeMenu(true);
    };
    const handlePointer = (event) => {
      if (navigationRef.current?.contains(event.target) || menuButtonRef.current?.contains(event.target)) return;
      closeMenu();
    };
    window.addEventListener("keydown", handleKeyboard);
    window.addEventListener("pointerdown", handlePointer);
    return () => {
      window.removeEventListener("keydown", handleKeyboard);
      window.removeEventListener("pointerdown", handlePointer);
    };
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Walter Thornton
        </a>

        <nav ref={navigationRef} id="primary-navigation" className={`site-navigation ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          <ul>
            {navLinks.map(({ link, name, mobileOnly }) => (
              <li key={name} className={`group ${mobileOnly ? "mobile-only-nav" : ""}`}>
                <a href={link} onClick={() => setMenuOpen(false)}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button ref={menuButtonRef} className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="sr-only">Toggle navigation</span>{menuOpen ? "Close" : "Menu"}
        </button>

        <a href="#contact" className="contact-btn group">
          <div className="inner">
            <span>Contact me</span>
          </div>
        </a>
      </div>
    </header>
  );
}

export default NavBar;
