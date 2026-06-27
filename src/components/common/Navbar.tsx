import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Sun, Moon, Lock, Unlock, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/journey', label: 'Journey' },
    { to: '/explore', label: 'Explore' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-4 bg-surface/90 dark:bg-surface-dim/95 shadow-sm border-b border-outline-variant/30 dark:border-outline/20 backdrop-blur-xl'
          : 'py-6 bg-surface/85 dark:bg-surface-dim/80 border-b border-transparent backdrop-blur-md'
      }`}
    >
      <div className="flex justify-between items-center px-margin-desktop w-full max-w-container-max mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Compass className="w-6 h-6 text-primary dark:text-primary-fixed group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-headline-sm text-headline-sm tracking-tight text-primary dark:text-primary-fixed">
            EuroVenture
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-body-md font-label-caps uppercase tracking-wider transition-all duration-300 pb-1 border-b-2 hover:text-primary dark:hover:text-primary-fixed ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed border-primary dark:border-primary-fixed font-bold'
                    : 'text-secondary dark:text-secondary-fixed-dim border-transparent'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Buttons & Utilities */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed rounded-full hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Admin Lock status */}
          <Link
            to={isAdmin ? '/admin' : '/admin'}
            className="p-2 text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed rounded-full hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
            title={isAdmin ? 'Admin Dashboard (Logged In)' : 'Admin Login'}
          >
            {isAdmin ? (
              <Unlock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </Link>

          {/* Action Call */}
          {isAdmin ? (
            <button
              onClick={() => logout()}
              className="px-5 py-2 bg-error text-on-error rounded-xl font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
            >
              Logout
            </button>
          ) : (
            <a
              href="mailto:contact@euroventure.com"
              className="px-5 py-2 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed rounded-xl font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
            >
              Contact
            </a>
          )}
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-secondary dark:text-secondary-fixed-dim rounded-full hover:bg-surface-container"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-primary dark:text-primary-fixed rounded-full hover:bg-surface-container"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-surface dark:bg-surface-dim border-b border-outline-variant/30 dark:border-outline/20 p-6 flex flex-col space-y-4 shadow-lg backdrop-blur-xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-body-md font-label-caps uppercase tracking-wider py-2 block ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed font-bold'
                    : 'text-secondary dark:text-secondary-fixed-dim'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-outline-variant/30 dark:border-outline/20 flex flex-col gap-3">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant/60 rounded-xl font-label-caps text-label-caps text-primary dark:text-primary-fixed hover:bg-surface-container transition-colors"
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-500" />
                  Dashboard
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Admin Login
                </>
              )}
            </Link>
            {isAdmin ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-4 bg-error text-on-error rounded-xl font-label-caps text-label-caps text-center"
              >
                Logout
              </button>
            ) : (
              <a
                href="mailto:contact@euroventure.com"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed rounded-xl font-label-caps text-label-caps text-center"
              >
                Contact
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
