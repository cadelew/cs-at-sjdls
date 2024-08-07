import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className='h-full w-full bg-amber-50 dark:bg-black'>
      <div className='hero h-80vh'>
        <div className='hero-content text-center '>
          <div className='max-w-xl relative'>
            <h1 className='mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-6xl font-extrabold dark:text-transparent text-center'>
              <span className='absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-6xl box-content font-extrabold text-transparent select-none'>
                Welcome.
              </span>
              Welcome.
            </h1>
            <Link
              to='/getting-started'
              className='text-black dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 border-black border dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
            >
              Start Here
            </Link>
          </div>
        </div>
      </div>
      <div className='py-20'>
        <h1 className='mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-6xl font-extrabold dark:text-transparent text-center'>
          <span className='absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-6xl box-content font-extrabold text-transparent select-none'>
            Ready to Go?
          </span>
          Ready to Go?
        </h1>
        <div className='flex flex-col items-center justify-between md:flex-row md:justify-evenly '>
          <div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'>
            <a href='#'>
              <h5 className='mb-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white'>
                Computer Science Essentials
              </h5>
            </a>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
              Filler Text
            </p>
            <a
              href='#'
              className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black dark:text-white bg-amber-50 rounded-lg border-black hover:bg-amber-100 dark:bg-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
            >
              Go to CSE Home
              <svg
                className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 5h12m0 0L9 1m4 4L9 9'
                />
              </svg>
            </a>
          </div>
          <div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'>
            <a href='#'>
              <h5 className='mb-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white'>
                Computer Science Essentials
              </h5>
            </a>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
              Filler Text
            </p>
            <a
              href='#'
              className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black dark:text-white bg-amber-50 rounded-lg border-black hover:bg-amber-100 dark:bg-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
            >
              Go to CSE Home
              <svg
                className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 5h12m0 0L9 1m4 4L9 9'
                />
              </svg>
            </a>
          </div>

          <div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'>
            <a href='#'>
              <h5 className='mb-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white'>
                Computer Science Essentials
              </h5>
            </a>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
              Filler Text
            </p>
            <a
              href='#'
              className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black dark:text-white bg-amber-50 rounded-lg border-black hover:bg-amber-100 dark:bg-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
            >
              Go to CSE Home
              <svg
                className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 5h12m0 0L9 1m4 4L9 9'
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
