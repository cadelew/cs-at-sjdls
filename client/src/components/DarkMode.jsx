// Theme toggle
import React from 'react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('color-theme');
    return savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode((prev) => !prev);
  };
  return (
    <label className='inline-flex items-center cursor-pointer flex-col justify-center'>
      <input
        type='checkbox'
        value=''
        id='theme-toggle-checkbox'
        className='sr-only peer'
        checked={isDarkMode}
        onChange={handleToggle}
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-950 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-transparent after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:border-transparent after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-transparent peer-checked:bg-purple-800"></div>
      <span className='text-center text-sm font-medium text-black dark:text-gray-300'>
        Dark Mode
      </span>
    </label>
  );
}
