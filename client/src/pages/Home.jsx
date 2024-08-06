import React from 'react';
import { useState } from 'react';

export default function Home() {
  return (
    <div className='h-full w-full bg-amber-50 dark:bg-black'>
      <div className='hero h-80vh'>
        <div className='hero-content text-center '>
          <div className='max-w-xl relative'>
            <h1 className='mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-6xl font-extrabold dark:text-transparent text-center'>
              <span className='absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-6xl box-content font-extrabold text-transparent select-none'>
                Welcome to Computer Science at SJDLS
              </span>
              Welcome to Computer Science at SJDLS
            </h1>
            <a
              href='#classes'
              className='text-black dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 border-black border dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
            >
              Learn About the Courses
            </a>
          </div>
        </div>
      </div>
      <div className='mt-20 min-h-screen bg-amber-50 dark:bg-black'>
        <div className='text-center '>
          <h1 className='text-black dark:text-purple-800 text-4xl font-extrabold mb-10'>
            PLTW Course Offerings
          </h1>
        </div>
        <ul id='classes' className='timeline timeline-vertical text-white'>
          <li>
            <div className='timeline-start timeline-box border-black bg-amber-50 dark:bg-black dark:border-purple-500 mr-3 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7] w-full md:w-96'>
              <div className='text-center text-lg font-bold text-black dark:text-white'>
                Computer Science Essentials
              </div>
              <div className='text-black dark:text-white'>Filler text</div>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className='timeline-end timeline-box border-black bg-amber-50 dark:bg-black dark:border-purple-500 ml-3 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7] w-full md:w-96'>
              <div className='text-center text-lg font-bold text-black dark:text-white'>
                AP Computer Science Principles
              </div>
              <div className='text-black dark:text-white'>Filler text</div>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className='timeline-start timeline-box border-black bg-amber-50 dark:bg-black dark:border-purple-500 mr-3 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7] w-full md:w-96'>
              <div className='text-center text-lg font-bold text-black dark:text-white'>
                Cybersecurity
              </div>
              <div className='text-black dark:text-white'>Filler text</div>
            </div>
            <hr />
          </li>
        </ul>
      </div>
    </div>
  );
}
