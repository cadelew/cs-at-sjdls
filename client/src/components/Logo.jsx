import React from 'react';
import purpleRain from '../images/purple-rain.gif'; // Adjust the path as needed

const Logo = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='bg-cover bg-no-repeat w-full'>
        <h1
          className='text-black text-3xl md:text-3xl uppercase text-center font-extrabold'
          style={{
            backgroundImage: `url(${purpleRain})`,
            backgroundSize: 'cover',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CS @ SJDLS
        </h1>
      </div>
    </div>
  );
};

export default Logo;
