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
      <div
        className='pt-20 md:w-1/2 w-full text-black dark:text-white'
        id='overview'
      >
        <h1 className='mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-6xl font-extrabold dark:text-transparent text-center'>
          <span className='absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-6xl box-content font-extrabold text-transparent select-none'>
            Getting Started
          </span>
          Getting Started
        </h1>
        <div>
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
            id='understanding-os'
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
            <div className='py-5 flex justify-center'>
              <img
                className=' max-h-32'
                src='https://static.vecteezy.com/system/resources/previews/016/460/828/original/windows-os-logo-top-operating-system-signs-free-png.png'
                alt='Windows Logo'
              />
            </div>
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
            <div className='py-5 flex justify-center'>
              <img
                className=' max-h-32'
                src='https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png'
                alt='MacOS Logo'
              />
            </div>
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
            <div className='py-5 flex justify-center'>
              <img
                className=' max-w-64'
                src='https://pngimg.com/d/linux_PNG29.png'
                alt='Linux Logo'
              />
            </div>
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
            id='os-winner'
          >
            <h1 className='font-bold text-3xl text-center pb-5'>
              The Clear OS Winner
            </h1>
            <div className='py-5 flex justify-center'>
              <img
                className=' max-w-64'
                src='https://pngimg.com/d/linux_PNG29.png'
                alt='Linux Logo'
              />
            </div>
            <h3>
              Linux has established itself as the premier operating system for
              professionals in computer science and cybersecurity. Its
              unparalleled flexibility and control make it the go-to platform
              for developing and testing applications, managing security, and
              running complex simulations. The operating system’s robust toolset
              includes essential software for development, penetration testing,
              and forensic analysis, all of which are integral to the industry.
              Linux's reputation for stability and security further cements its
              role as the standard choice in environments where reliability and
              protection are paramount. For those working in these fields, Linux
              is not just a tool; it is the foundation upon which much of modern
              technology is built and secured.
            </h3>
            <h2 className='font-bold text-xl my-5'>
              Popular Linux Distributions in Computer Science and Cybersecurity
            </h2>
            <h3>
              Linux comes in various <strong>distributions (distros)</strong>,
              each tailored to different needs and preferences. In the fields of
              computer science and cybersecurity, certain distros have become
              particularly popular due to their specialized tools, stability,
              and community support. Linux distros have a{' '}
              <strong> graphical user interface (GUI) </strong>
              or a <strong>command line interface (CLI)</strong> or both. Here’s
              a look at some of the main Linux distributions and how they are
              used by professionals in these fields:
            </h3>

            <ol className='my-5 space-y-4 text-black list-decimal list-inside dark:text-white'>
              <li className='text-lg font-semibold'>
                Ubuntu* (Both Cybersecurity and Computer Science)
                <div className='py-5 flex justify-center'>
                  <img
                    className=' max-h-32'
                    src='https://seeklogo.com/images/U/ubuntu-logo-8B7C9ED4AD-seeklogo.com.png'
                    alt='Ubuntu Logo'
                  />
                </div>
                <ul className='text-base font-normal pl-5 ps-5 mt-2 space-y-2 list-disc'>
                  <li>
                    <strong>Overview:</strong> Ubuntu is one of the most popular
                    and user-friendly Linux distributions, known for its ease of
                    installation and strong community support. It’s often the
                    first choice for beginners but also widely used by
                    professionals for development and testing.
                  </li>
                  <li>
                    <strong>Use in Computer Science:</strong> Ubuntu is favored
                    for its broad software compatibility, making it ideal for
                    programming, software development, and running various
                    development environments. It’s also commonly used in
                    educational settings for teaching Linux basics.
                  </li>
                  <li>
                    <strong>Use in Cybersecurity:</strong> While not
                    specifically designed for cybersecurity, Ubuntu serves as a
                    solid foundation for building custom security tools or
                    running penetration testing frameworks. Its stability and
                    ease of use make it a reliable choice for general-purpose
                    cybersecurity tasks.
                  </li>
                  <li>
                    <strong>UI Details:</strong> Ubuntu comes with a
                    user-friendly GUI by default, typically using the GNOME
                    desktop environment, making it accessible to users familiar
                    with graphical interfaces. It also provides a robust CLI,
                    which is essential for development tasks, scripting, and
                    system management.
                  </li>
                </ul>
              </li>
              <li className='text-lg font-semibold'>
                Kali Linux (Mainly Cybersecurity)
                <div className='py-5 flex justify-center'>
                  <img
                    className=' max-h-32'
                    src='https://static-00.iconduck.com/assets.00/distributor-logo-kali-linux-icon-2048x2005-dki611fk.png'
                    alt='Kali Linux Logo'
                  />
                </div>
                <ul className='text-base font-normal ps-5 mt-2 space-y-2 list-disc list-inside'>
                  <li>
                    <strong>Overview</strong>: Kali Linux is a specialized
                    distribution designed specifically for penetration testing,
                    ethical hacking, and security research. It comes
                    pre-installed with hundreds of tools tailored for these
                    purposes.
                  </li>
                  <li>
                    <strong>Use in Computer Science:</strong> While not a
                    general-purpose development distro, Kali Linux is invaluable
                    for computer scientists who need to test the security of
                    their applications or networks. It’s often used in academic
                    settings to teach students about cybersecurity practices.
                  </li>
                  <li>
                    <strong>Use in Cybersecurity:</strong> Kali is the go-to
                    distribution for cybersecurity professionals engaged in
                    penetration testing, vulnerability assessments, and digital
                    forensics. Its extensive toolset includes Nmap, Metasploit,
                    Wireshark, and many others, making it an essential platform
                    for ethical hackers and security researchers.
                  </li>
                  <li>
                    <strong>UI Details:</strong> Kali Linux offers both a GUI
                    and CLI, with the XFCE desktop environment as its default
                    GUI. The GUI is particularly useful for navigating the
                    extensive suite of tools included in Kali, while the CLI is
                    indispensable for tasks like network scanning, scripting,
                    and running penetration tests.
                  </li>
                </ul>
              </li>
              <li className='text-lg font-semibold'>
                Fedora (Mainly Computer Science and DevOps/IT)
                <div className='py-5 flex justify-center'>
                  <img
                    className=' max-h-24'
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fedora_logo_%282021%29.svg/1200px-Fedora_logo_%282021%29.svg.png'
                    alt='Fedora Logo'
                  />
                </div>
                <ul className='text-base font-normal ps-5 mt-2 space-y-2 list-disc list-inside'>
                  <li>
                    <strong>Overview:</strong> Fedora is a cutting-edge
                    distribution sponsored by Red Hat, known for integrating the
                    latest features and technologies. It’s popular among
                    developers and system administrators who need a stable and
                    innovative environment.
                  </li>
                  <li>
                    <strong>Use in Computer Science:</strong> Fedora is often
                    used by developers who want to work with the latest software
                    and development tools. Its robust package management and
                    support for containerization technologies like Docker make
                    it ideal for modern software development.
                  </li>
                  <li>
                    <strong>Use in Cybersecurity:</strong> Fedora is used in
                    cybersecurity for its reliability and support for security
                    tools. While not as specialized as Kali Linux, it’s often
                    employed in environments where both development and security
                    tasks are performed.
                  </li>
                  <li>
                    <strong>UI Details:</strong> Fedora provides both a GUI and
                    CLI, with GNOME as its default desktop environment. The GUI
                    offers a polished and modern user experience, while the CLI
                    is powerful and widely used for development, system
                    administration, and container management.
                  </li>
                </ul>
              </li>
              <li className='text-lg font-semibold'>
                CentOS
                <div className='py-5 flex justify-center'>
                  <img
                    className=' max-h-32'
                    src='https://cdn.freebiesupply.com/logos/large/2x/centos-1-logo-png-transparent.png'
                    alt='centOS logo'
                  />
                </div>
                <ul className='text-base font-normal ps-5 mt-2 space-y-2 list-disc list-inside'>
                  <li>
                    <strong>Overview:</strong> CentOS is a community-driven
                    distribution that is functionally compatible with Red Hat
                    Enterprise Linux (RHEL). It’s known for its stability and
                    long-term support, making it a preferred choice for
                    enterprise environments.
                  </li>
                  <li>
                    <strong>Use in Computer Science:</strong> CentOS is commonly
                    used in enterprise software development, particularly in
                    scenarios where stability and long-term support are crucial.
                    It’s also popular for running servers and developing
                    applications intended for RHEL environments.
                  </li>
                  <li>
                    <strong>Use in Cybersecurity:</strong> In cybersecurity,
                    CentOS is used in environments that require a stable,
                    secure, and reliable platform for running security tools,
                    managing servers, and deploying enterprise applications. Its
                    stability makes it a trusted choice for critical
                    infrastructure.
                  </li>
                  <li>
                    <strong>UI Details:</strong> CentOS includes both a GUI and
                    CLI, with GNOME as the typical desktop environment for those
                    who install the GUI. However, it is often used in a CLI-only
                    mode, particularly on servers where a graphical interface is
                    unnecessary and the focus is on stability and performance.
                  </li>
                </ul>
              </li>
              {/* <li className='font-semibold'>
                Parrot Security OS
                <div className='py-5 flex justify-center'>
                  <img
                    className=' max-h-32'
                    src='https://cylab.be/storage/blog/205/files/ZyBJGF6lu6YnQ0XM/parrot_logo2.png'
                  />
                </div>
                <ul className='font-normal ps-5 mt-2 space-y-2 list-disc list-inside'>
                  <li>Again please don't nest lists if you want</li>
                  <li>Nobody wants to look at this.</li>
                  <li>I'm upset that we even have to bother styling this.</li>
                </ul>
              </li> */}
              <li className='font-semibold'>
                Debian*
                <div className='py-5 flex justify-center'>
                  <img
                    className=' max-h-32'
                    src='https://cdn.iconscout.com/icon/free/png-256/free-debian-2-202378.png?f=webp'
                    alt='Debian Logo'
                  />
                </div>
                <ul className='font-normal ps-5 mt-2 space-y-2 list-disc list-inside'>
                  <li>
                    <strong>Overview:</strong> Debian is one of the oldest and
                    most stable Linux distributions. It’s known for its rigorous
                    testing and commitment to free software, making it a
                    reliable choice for both servers and desktops.
                  </li>
                  <li>
                    <strong>Use in Computer Science:</strong> Debian’s stability
                    and extensive package repository make it a favorite among
                    developers who need a reliable and consistent environment.
                    It’s also used as the base for many other distributions,
                    including Ubuntu.
                  </li>
                  <li>
                    <strong>Use in Cybersecurity:</strong> While not as
                    specialized as Kali or Parrot, Debian is used in
                    cybersecurity for tasks that require a stable and secure
                    platform. Its robustness makes it suitable for running
                    security tools, managing servers, and performing system
                    hardening.
                  </li>
                  <li>
                    <strong>UI Details:</strong> Debian offers both a GUI and
                    CLI, with multiple desktop environments available, such as
                    GNOME, KDE, XFCE, and LXDE. Debian is highly flexible,
                    allowing users to install a minimal CLI-only system or a
                    full-featured desktop environment depending on their needs.
                  </li>
                </ul>
              </li>
            </ol>
            <h1 className='font-bold'>* Used in CyberPatriot competitions</h1>
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
