import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GettingStarted() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className='flex justify-center min-h-screen min-w-screen dark:bg-black bg-amber-50'>
      {/* <div className='flex justify-center min-h-screen'> */}
      <div className='pt-20 md:w-1/2 w-full text-black dark:text-white'>
        <h1 className='mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-6xl font-extrabold dark:text-transparent text-center'>
          <span className='absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-6xl box-content font-extrabold text-transparent select-none'>
            Getting Started
          </span>
          Getting Started
        </h1>
        <div id='overview'>
          <h1 className='pb-5 font-bold flex-start text-lg'>Overview</h1>
          <h3 className='flex-start flex-wrap'>
            This is where it all begins! A hands-on introduction to all of the
            essential tools you'll need to build real, working websites. You'll
            learn what web developers actually do – the foundations you'll need
            for later courses.
          </h3>
        </div>
        <ul className='flex flex-col justify-center my-10 border-y border-b-0 pt-5  pb-10 dark:border-white border-black'>
          <li
            className='justify-center border-t-inherit pt-5 pb-10 dark:border-white border-black'
            id='understanding-os '
          >
            <h1 className='font-bold text-3xl text-center pb-5'>
              Understanding Operating Systems (OS)
            </h1>
            <h3>
              Operating systems (OS) are the backbone of any computer, managing
              everything from running applications to handling files and
              security. For software engineers and computer scientists, choosing
              the right OS can significantly impact productivity, performance,
              and user experience. In this blog, we’ll explore the pros and cons
              of three popular operating systems—Windows, macOS, and
              Linux—focusing on performance, user interface (UI), and their
              suitability for software development.
            </h3>

            {/* Windows Section */}
            <h2 className='font-bold text-xl my-5'>Windows</h2>
            <h3>
              Windows is the most commonly used operating system, especially in
              businesses, schools, and homes. It's known for its compatibility
              with a wide range of software and hardware, making it a go-to
              choice for many professionals. But how does it stack up for
              software engineers and computer scientists?
            </h3>
            <div className='md:ml-3'>
              <h2 className='mt-5 my-2 font-semibold text-lg text-black dark:text-white'>
                Pros:
              </h2>
              <ul className='pl-5 space-y-2 text-black list-disc list-outside dark:text-white'>
                <li>
                  <strong className='font-semibold'>Performance:</strong>{' '}
                  Windows supports a wide range of hardware, from budget to
                  high-end systems, and is optimized for performance across
                  various tasks, including gaming and software development.
                </li>
                <li>
                  <strong className='font-semibold'>
                    User-Friendly Interface:
                  </strong>{' '}
                  The user interface is intuitive and easy to navigate, with a
                  well-known Start Menu and taskbar that help users quickly
                  access applications and settings.
                </li>
                <li>
                  <strong className='font-semibold'>
                    Strong Support for Microsoft Technologies:
                  </strong>{' '}
                  Great for developers using .NET, C#, or other
                  Microsoft-centric tools.
                </li>
                <li>
                  <strong className='font-semibold'>Large User Base:</strong>{' '}
                  Easier to find solutions and community support for
                  Windows-related issues.
                </li>
              </ul>
            </div>
            <div className='md:ml-3'>
              <h2 className='mt-5 my-2 font-semibold text-lg text-black dark:text-white'>
                Cons:
              </h2>
              <ul className='pl-5 space-y-2 text-black list-disc list-outside dark:text-white'>
                <li>
                  <strong className='font-semibold'>
                    Performance Overhead:
                  </strong>{' '}
                  Windows can be resource-intensive, especially with background
                  processes and updates that may slow down the system over time.
                </li>
                <li>
                  <strong className='font-semibold'>
                    UI Customization Limits:
                  </strong>{' '}
                  While the UI is user-friendly, it offers limited customization
                  compared to Linux, which might be a drawback for users who
                  prefer a personalized setup.
                </li>
                <li>
                  <strong className='font-semibold'>Security Concerns:</strong>{' '}
                  Windows is often targeted by malware, requiring robust
                  security measures, which can impact performance.
                </li>
                <li>
                  <strong className='font-semibold'>Licensing Costs:</strong>{' '}
                  Windows is a paid OS, which adds to the overall cost,
                  especially if you need additional software like Microsoft
                  Office.
                </li>
              </ul>
            </div>

            {/* macOS Section */}
            <h2 className='font-bold text-xl my-5'>macOS</h2>
            <h3>
              macOS is Apple's operating system, known for its sleek design,
              seamless integration with other Apple devices, and strong security
              features. It’s particularly popular among creative professionals
              and developers working in the Apple ecosystem.
            </h3>
            <div className='md:ml-3'>
              <h2 className='mt-5 my-2 font-semibold text-lg text-black dark:text-white'>
                Pros:
              </h2>
              <ul className='pl-5 space-y-2 text-black list-disc list-outside dark:text-white'>
                <li>
                  <strong className='font-semibold'>Performance:</strong> macOS
                  is optimized for Apple hardware, providing excellent
                  performance and stability, particularly on high-end devices
                  like the MacBook Pro and iMac.
                </li>
                <li>
                  <strong className='font-semibold'>UI:</strong> The user
                  interface is clean, elegant, and consistent across all
                  applications, offering a smooth and visually appealing user
                  experience.
                </li>
                <li>
                  <strong className='font-semibold'>Security:</strong> macOS is
                  built with strong security features, reducing the risk of
                  malware and ensuring a stable environment for development.
                </li>
                <li>
                  <strong className='font-semibold'>Unix-based:</strong> macOS’s
                  Unix foundation provides powerful terminal tools, which are
                  beneficial for developers who need a reliable command-line
                  interface.
                </li>
              </ul>
            </div>
            <div className='md:ml-3'>
              <h2 className='mt-5 my-2 font-semibold text-lg text-black dark:text-white'>
                Cons:
              </h2>
              <ul className='pl-5 space-y-2 text-black list-disc list-outside dark:text-white'>
                <li>
                  <strong className='font-semibold'>Cost:</strong> Apple’s
                  hardware, which is required to run macOS, is often more
                  expensive than comparable Windows or Linux systems, making it
                  less accessible for some users.
                </li>
                <li>
                  <strong className='font-semibold'>UI Customization:</strong>{' '}
                  While the UI is polished and user-friendly, it offers limited
                  customization compared to Linux, restricting how users can
                  personalize their environment.
                </li>
                <li>
                  <strong className='font-semibold'>
                    Limited Software Availability:
                  </strong>{' '}
                  Not all software, especially certain games and niche
                  development tools, are available on macOS, which can limit
                  versatility.
                </li>
                <li>
                  <strong className='font-semibold'>
                    Performance on Lower-End Devices:
                  </strong>{' '}
                  macOS is optimized for Apple’s premium hardware, meaning it
                  may not perform as well on older or less powerful devices.
                </li>
              </ul>
            </div>
            <h2 className='font-bold text-xl my-5'>Linux</h2>
            <h3>
              Linux is an open-source operating system that offers unparalleled
              customization and control. It's widely used by developers,
              particularly those working in server environments, cybersecurity,
              and system administration.
            </h3>
            <div className='md:ml-3'>
              <h2 className='mt-5 my-2 font-semibold text-lg text-black dark:text-white'>
                Pros:
              </h2>
              <ul className='pl-5 space-y-2 text-black list-disc list-outside dark:text-white'>
                <li>
                  <strong className='font-semibold'>Performance:</strong> Linux
                  is lightweight and efficient, often outperforming other
                  operating systems on the same hardware. It’s especially
                  effective on older machines or in environments where system
                  resources are limited.
                </li>
                <li>
                  <strong className='font-semibold'>UI:</strong> Linux offers a
                  wide variety of desktop environments (like GNOME, KDE, and
                  XFCE), allowing users to customize the UI to their liking,
                  from minimalist to feature-rich setups.
                </li>
                <li>
                  <strong className='font-semibold'>Customization:</strong>{' '}
                  Linux provides full control over the system, from the desktop
                  environment to the kernel, allowing developers to tailor the
                  OS to their specific needs.
                </li>
                <li>
                  <strong className='font-semibold'>
                    Security and Stability:
                  </strong>{' '}
                  Linux is known for its strong security model and stability,
                  making it ideal for servers and environments where uptime is
                  critical.
                </li>
              </ul>
            </div>
            <div className='md:ml-3'>
              <h2 className='mt-5 my-2 font-semibold text-lg text-black dark:text-white'>
                Cons:
              </h2>
              <ul className='pl-5 space-y-2 text-black list-disc list-outside dark:text-white'>
                <li>
                  <strong className='font-semibold'>Learning Curve:</strong> The
                  command-line interface is powerful but can be intimidating for
                  beginners, making Linux harder to learn and use initially.
                </li>
                <li>
                  <strong className='font-semibold'>
                    Software Compatibility:
                  </strong>{' '}
                  Not all software is natively compatible with Linux, and while
                  alternatives or workarounds (like Wine or virtual machines)
                  exist, they can impact performance or usability.
                </li>
                <li>
                  <strong className='font-semibold'>UI Consistency:</strong>{' '}
                  While customizable, the variety of desktop environments can
                  lead to inconsistencies in UI, which might confuse users
                  transitioning between different Linux distributions.
                </li>
                <li>
                  <strong className='font-semibold'>
                    Mainstream Software Availability:
                  </strong>{' '}
                  Some popular applications, particularly in gaming and
                  proprietary software, may not be available or require extra
                  effort to run on Linux.
                </li>
              </ul>
            </div>
          </li>
          <li
            className='justify-center border-y py-10 dark:border-white border-black'
            id='understanding-os'
          >
            <h1 className='font-bold text-3xl text-center pb-5'>
              The Clear OS Winner
            </h1>
            <div className='flex justify-center'>
              <img
                className=' max-w-64'
                src='https://pngimg.com/d/linux_PNG29.png'
              />
            </div>
            <h3></h3>
          </li>
        </ul>
      </div>
      {/* </div> */}
      {/* Button to Toggle Drawer */}
      <button
        className='fixed top-1/2 left-0 transform -translate-y-1/2 bg-amber-50 text-black dark:bg-black dark:text-white p-3 h-16 flex items-center justify-center rounded-r-lg focus:outline-none flex-wrap border-black  border dark:border-l-black  dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]'
        onClick={toggleDrawer}
      >
        <span className='hidden md:block transform text-lg font-bold'>
          Content
        </span>
        <svg
          aria-hidden='true'
          className='w-6 h-6 transform rotate-[-90deg]'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414L10 14.414l-4.293-4.293a1 1 0 010-1.414z'
            clipRule='evenodd'
          ></path>
        </svg>
      </button>

      {/* Drawer Component */}
      <div
        id='drawer-navigation'
        className={`fixed top-0 left-0 z-40 w-64 bg:w-72  h-screen p-4 overflow-y-auto transition-transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full dark:shadow-none'
        } border-r-black bg-amber-50 dark:bg-black border-r dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7]`}
        tabIndex='-1'
        aria-labelledby='drawer-navigation-label'
      >
        <h5
          id='drawer-navigation-label'
          className='text-base font-semibold text-black dark:text-white uppercase'
        >
          Content
        </h5>
        <button
          type='button'
          onClick={toggleDrawer}
          aria-controls='drawer-navigation'
          className='text-black dark:text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
        >
          <svg
            aria-hidden='true'
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>
        <div className='py-4 overflow-y-auto'>
          <ul className='space-y-2 font-medium'>
            {/* List of navigation items */}
            <li>
              <a
                href='#overview'
                className='flex items-center p-2 text-black rounded-lg dark:hover:text-purple-500 dark:text-white group'
              >
                <span className='ms-3'>Overview</span>
              </a>
            </li>
            <li>
              <a
                href='#understanding-os'
                className='flex items-center p-2 text-black-900 rounded-lg dark:hover:text-purple-500 dark:text-white group'
              >
                <span className='ms-3'>Understanding OS</span>
              </a>
            </li>
            <li>
              <a
                href='#os-winner'
                className='flex items-center p-2 text-black-900 rounded-lg dark:hover:text-purple-500 dark:text-white group'
              >
                <span className='ms-3'>The Clear OS Winner</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
