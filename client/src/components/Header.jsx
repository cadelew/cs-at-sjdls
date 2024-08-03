import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ThemeToggle from './DarkMode.jsx';
import Logo from './Logo.jsx';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCspOpen, setCspOpen] = useState(false);
  const [isCyberOpen, setCyberOpen] = useState(false);

  const toggleCsp = () => {
    setCspOpen((prev) => !prev);
  };

  const toggleCyber = () => {
    setCyberOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className='bg-amber-50 dark:bg-black border-transparent'>
      <div className='flex flex-wrap items-center justify-between max-w-screen-xl mx-auto p-4'>
        <Link to='/'>
          <Logo />
        </Link>
        <div className='flex items-center md:order-2 space-x-3 md:space-x-3 rtl:space-x-reverse'>
          <ThemeToggle className='pt-1' />
          {!currentUser ? (
            <>
              <Link
                to='/sign-in'
                className='text-black dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
              >
                Sign In
              </Link>
              <Link
                to='/sign-up'
                className='text-white bg-purple-800 hover:bg-purple-950 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:bg-purple-800 dark:hover:bg-purple-950 focus:outline-none dark:focus:ring-purple-950'
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to='/profile'>
                <img
                  src={currentUser.profilePicture}
                  alt='profile'
                  className='h-10 w-10 rounded-full object-cover'
                />
              </Link>
              <button
                onClick={toggleMenu}
                data-collapse-toggle='mega-menu'
                type='button'
                className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden focus:outline-none dark:text-white'
                aria-controls='mega-menu'
                aria-expanded={isMenuOpen}
              >
                <span className='sr-only'>Open main menu</span>
                {isMenuOpen ? (
                  <>
                    <svg
                      className='w-6 h-6'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      className='w-5 h-5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 17 14'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M1 1h15M1 7h15M1 13h15'
                      />
                    </svg>
                  </>
                )}
              </button>
            </>
          )}
        </div>
        {currentUser && (
          <>
            <div
              id='mega-menu'
              className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
                isMenuOpen ? 'block' : 'hidden'
              }`}
            >
              <ul className='flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse'>
                <li>
                  <button
                    onClick={toggleCsp}
                    id='mega-menu-dropdown-button'
                    data-dropdown-toggle='mega-menu-dropdown'
                    className='flex items-center justify-between w-full py-2 px-3 font-medium text-black border-b border-black-100 md:w-auto  md:border-0 md:p-0 dark:text-white md:dark:hover:bg-transparent dark:border-white hover:font-bold'
                  >
                    AP CSP
                    <svg
                      className='w-2.5 h-2.5 ms-3'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 10 6'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 1 4 4 4-4'
                      />
                    </svg>
                  </button>
                  <div
                    id='mega-menu-dropdown'
                    className={`absolute z-10 grid w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-2 dark:bg-gray-700 ${
                      isCspOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <div className='p-4 pb-0 text-gray-900 md:pb-4 dark:text-white'>
                      <ul
                        className='space-y-4'
                        aria-labelledby='mega-menu-dropdown-button'
                      >
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:font-bold'
                          >
                            CSP Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:font-bold'
                          >
                            Checklist
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:font-bold'
                          >
                            Review
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    onClick={toggleCyber}
                    id='mega-menu-dropdown-button'
                    data-dropdown-toggle='mega-menu-dropdown'
                    className='flex items-center justify-between w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700'
                  >
                    Cybersecurity
                    <svg
                      className='w-2.5 h-2.5 ms-3'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 10 6'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 1 4 4 4-4'
                      />
                    </svg>
                  </button>
                  <div
                    id='mega-menu-dropdown'
                    className={`absolute z-10 grid w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-2 dark:bg-gray-700 ${
                      isCyberOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <div className='p-4 pb-0 text-gray-900 md:pb-4 dark:text-white'>
                      <ul
                        className='space-y-4'
                        aria-labelledby='mega-menu-dropdown-button'
                      >
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:font-bold'
                          >
                            Cybersecurity Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:font-bold'
                          >
                            Checklist
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:font-bold'
                          >
                            Environments
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    to='#'
                    className='block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700'
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
