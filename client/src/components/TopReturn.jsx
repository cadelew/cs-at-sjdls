import React from 'react';

export default function TopReturn() {
  return (
    <div className='fixed bottom-5 right-5 flex items-center'>
      <a href='#' aria-label='Return to top'>
        <button
          type='button'
          className='text-black dark:text-white dark:bg-black bg-amber-50 border border-black font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
        >
          <svg
            className='w-6 h-6 transform rotate-[-90deg]'
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
          <span className='sr-only'>Return to top</span>
        </button>
      </a>
    </div>
  );
}
