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
    <nav className='bg-amber-50 dark:bg-black border-transparent'>
      <div className='flex flex-wrap items-center justify-between max-w-screen-xl mx-auto p-4'>
        <Link to='/'>
          <Logo />
        </Link>
        <div className='flex justify-center items-center md:order-2 space-x-2 md:space-x-10 rtl:space-x-reverse'>
          <ThemeToggle className='mb-2' />
          {!currentUser ? (
            <>
              <Link
                to='/sign-in'
                className='text-black dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
              >
                Sign In
              </Link>
              <Link
                to='/sign-up'
                className='text-white bg-purple-800 hover:bg-purple-950 focus:ring-4 focus:ring-purple-300 font-bold rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:bg-purple-800 dark:hover:bg-purple-950 focus:outline-none dark:focus:ring-purple-950'
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
                  className={`h-10 w-10 rounded-full object-cover dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]`}
                />
              </Link>
              <button
                onClick={toggleMenu}
                data-collapse-toggle='mega-menu'
                type='button'
                className='inline-flex items-center py-2 pl-2 pr-0 md:p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden focus:outline-none dark:text-white'
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
              <ul className='flex flex-col mt-4 font-bold md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse'>
                <li>
                  <button
                    onClick={toggleCsp}
                    id='mega-menu-dropdown-button'
                    data-dropdown-toggle='mega-menu-dropdown'
                    className='flex items-center justify-between w-full py-2 px-3 font-bold text-black border-b border-black-100 md:w-auto md:border-0 md:p-0 dark:text-white md:dark:hover:bg-transparent dark:border-white hover:text-purple-600 dark:hover:text-purple-500'
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
                    className={`absolute left-1/2 transform -translate-x-1/2 z-10 w-1/3 text-sm bg-white border border-gray-100 rounded-lg dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7] dark:bg-black ${
                      isCspOpen ? 'block mt-3' : 'hidden'
                    }`}
                  >
                    <div className='p-4 pb-0 text-gray-900 md:pb-4 dark:text-white'>
                      <ul className="flex flex-col md:mx-10 md:flex-row md:space-x-4 md:justify-between aria-labelledby='mega-menu-dropdown-button">
                        <li>
                          <Link
                            to='/'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-500'
                          >
                            CSP Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-500'
                          >
                            Checklist
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-500'
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
                    className='flex items-center justify-between w-full py-2 px-3 font-bold text-black border-b border-black-100 md:w-auto md:border-0 md:p-0 dark:text-white md:dark:hover:bg-transparent dark:border-white hover:text-purple-600 dark:hover:text-purple-500'
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
                    className={`absolute left-1/2 transform -translate-x-1/2 z-10 w-1/3 text-sm bg-white border border-gray-100 rounded-lg dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7] dark:bg-black ${
                      isCyberOpen ? 'block mt-3' : 'hidden'
                    }`}
                  >
                    <div className='p-4 pb-0 text-gray-900 md:pb-4 dark:text-white'>
                      <ul className="flex flex-col md:mx-10 md:flex-row md:space-x-4 md:justify-between aria-labelledby='mega-menu-dropdown-button">
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-500'
                          >
                            Cybersecurity Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-500'
                          >
                            Checklist
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-500'
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
                    className='block py-2 px-3 text-gray-900 border-b border-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-purple-600 md:p-0 dark:text-white md:dark:hover:text-purple-500 dark:hover:text-purple-500 md:dark:hover:bg-transparent dark:border-white'
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
