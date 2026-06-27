import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface dark:bg-surface-dim border-t border-outline-variant/30 dark:border-outline/20 mt-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg gap-stack-md w-full max-w-container-max mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed">
            EuroVenture
          </span>
          <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim">
            © 2024 European Exchange Portfolio. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all font-label-caps text-label-caps"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all font-label-caps text-label-caps"
          >
            LinkedIn
          </a>
          <a
            href="mailto:contact@euroventure.com"
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all font-label-caps text-label-caps"
          >
            Email
          </a>
          <a
            href="#"
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all font-label-caps text-label-caps"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};
