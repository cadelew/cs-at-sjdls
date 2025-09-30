import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ThemeToggle from './DarkMode.jsx';
import Logo from './Logo.jsx';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCspOpen, setCspOpen] = useState(false);
  const [isCyberOpen, setCyberOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setCspOpen(false), setCyberOpen(false);
  }, [location]);

  const toggleCsp = () => {
    setCspOpen((prev) => !prev);
    if (isCyberOpen) {
      setCyberOpen(false);
    }
  };

  const toggleCyber = () => {
    setCyberOpen((prev) => !prev);
    if (isCspOpen) {
      setCspOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-amber-50 dark:bg-black border-b border-black dark:border-purple-500 shadow-lg'>
      <div className='flex flex-wrap items-center justify-between max-w-screen-xl mx-auto px-6 py-4'>
        {!currentUser ? (
          <Link to='/'>
            <Logo />
          </Link>
        ) : (
          <Link to='/dashboard'>
            <Logo />
          </Link>
        )}

        <div className='flex justify-center items-center md:order-2 space-x-4 md:space-x-8 rtl:space-x-reverse'>
          <ThemeToggle />
          {!currentUser ? (
            <>
              <Link
                to='/sign-in'
                className='text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 focus:ring-4 focus:ring-purple-300 font-semibold rounded-xl text-sm px-5 py-2.5 transition-all duration-300 border border-black dark:border-purple-500 hover:transform hover:scale-105'
              >
                Sign In
              </Link>
              <Link
                to='/sign-up'
                className='text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-semibold rounded-xl text-sm px-5 py-2.5 transition-all duration-300 hover:transform hover:scale-105 shadow-lg'
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to='/profile' className='hover:transform hover:scale-105 transition-all duration-300'>
                <img
                  src={currentUser.profilePicture}
                  alt='profile'
                  className='h-12 w-12 rounded-full object-cover border-2 border-black dark:border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300'
                />
              </Link>
              <button
                onClick={toggleMenu}
                data-collapse-toggle='mega-menu'
                type='button'
                className='inline-flex items-center py-2 pl-2 pr-0 md:p-2 w-12 h-12 justify-center text-sm text-black rounded-xl md:hidden focus:outline-none dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 transition-all duration-300'
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
              <ul className='flex flex-col mt-6 font-semibold md:flex-row md:mt-0 md:space-x-10 rtl:space-x-reverse'>
                <li>
                  <Link
                    to='getting-started'
                    className='block py-3 px-4 text-black dark:text-white border-b border-gray-200 dark:border-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-purple-600 md:p-0 dark:hover:text-purple-400 hover:text-purple-600 md:dark:hover:bg-transparent transition-all duration-300 hover:transform hover:scale-105'
                  >
                    Getting Started
                  </Link>
                </li>
                <li>
                  <button
                    onClick={toggleCsp}
                    id='mega-menu-dropdown-button'
                    data-dropdown-toggle='mega-menu-dropdown'
                    className='flex items-center justify-between w-full py-3 px-4 font-semibold text-black border-b border-gray-200 dark:border-gray-700 md:w-auto md:border-0 md:p-0 dark:text-white md:dark:hover:bg-transparent hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105'
                  >
                    PLTW CS
                    <svg
                      className='w-3 h-3 ms-3 transition-transform duration-300'
                      style={{ transform: isCspOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
                    className={`absolute left-1/2 transform -translate-x-1/2 z-10 w-1/3 text-sm bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-xl ${
                      isCspOpen ? 'block mt-4' : 'hidden'
                    }`}
                  >
                    <div className='p-6 pb-0 text-gray-900 md:pb-6 dark:text-white'>
                      <ul className="flex flex-col md:mx-10 md:flex-row md:space-x-6 md:justify-between aria-labelledby='mega-menu-dropdown-button">
                        <li>
                          <Link
                            to='/cs-home'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105 font-medium'
                          >
                            CS Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='/checklist'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105 font-medium'
                          >
                            AP CSP Checklist
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='/ap-csp-review'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105 font-medium'
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
                    className='flex items-center justify-between w-full py-3 px-4 font-semibold text-black border-b border-gray-200 dark:border-gray-700 md:w-auto md:border-0 md:p-0 dark:text-white md:dark:hover:bg-transparent hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105'
                  >
                    CyberPatriot
                    <svg
                      className='w-3 h-3 ms-3 transition-transform duration-300'
                      style={{ transform: isCyberOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
                    className={`absolute left-1/2 transform -translate-x-1/2 z-10 w-1/3 text-sm bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-xl ${
                      isCyberOpen ? 'block mt-4' : 'hidden'
                    }`}
                  >
                    <div className='p-6 text-gray-900 dark:text-white'>
                      <ul className="flex flex-col md:flex-row md:space-x-8 md:justify-center aria-labelledby='mega-menu-dropdown-button">
                        <li>
                          <Link
                            to='/cyberpatriot-home'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105 font-medium block py-2'
                          >
                            CyberPatriot Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='/cyberpatriot-checklist'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:transform hover:scale-105 font-medium block py-2'
                          >
                            CyberPatriot Checklist
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    to='/resources'
                    className='block py-3 px-4 text-black dark:text-white border-b border-gray-200 dark:border-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-purple-600 md:p-0 dark:hover:text-purple-400 hover:text-purple-600 md:dark:hover:bg-transparent transition-all duration-300 hover:transform hover:scale-105'
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
