import React from 'react';

export default function Resources() {
  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-6 relative py-6 flex justify-center items-center text-black dark:text-white text-5xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-5xl box-content font-extrabold text-transparent select-none">
              Resources
            </span>
            Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore opportunities, programs, and resources for high school students interested in computer science
          </p>
        </div>

        {/* Opportunities & Programs */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            Opportunities & Programs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Summer Programs
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.nsf.gov/crssprgm/reu/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    NSF Research Experiences for Undergraduates
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.summer.stanford.edu/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Stanford Pre-Collegiate Studies
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.mit.edu/admissions/apply/prepare/summer-programs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    MIT Summer Programs
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.cmu.edu/pre-college/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Carnegie Mellon Pre-College
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.girlswhocode.com/programs/summer-immersion-program" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Girls Who Code Summer Immersion
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Internships & Work Experience
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://cssicurriculum.withgoogle.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Google Student Programs
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.amazonfutureengineer.com/scholarships" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Amazon Future Engineer
                  </a>
                </li>
                <li>
                  <a 
                    href="https://compression.stanford.edu/outreach/shtem-summer-internships-high-schoolers-and-community-college-students" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Stanford SHTEM
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.sparksip.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Spark Summer Internship Program
                  </a>
                </li>
                <li>
                  <a 
                    href="https://intern.nasa.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    NASA OSTEM High School Internship Program
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.janestreet.com/amp/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Jane Street AMP Program
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Competitions & Challenges
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.uscyberpatriot.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    CyberPatriot Competition
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.usaco.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    USA Computing Olympiad
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.hackathons.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    High School Hackathons
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.firstinspires.org/robotics/frc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    FIRST Robotics Competition
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.nationalcyberscholarship.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    National Cyber Scholarship
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Opportunities */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Scholarships & Financial Aid
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=5057" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    NSF STEM Scholarships
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-major/computer-science-scholarships/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Computer Science Scholarships
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.gatesfoundation.org/about/committed-grants/2020/11/gates-scholarship" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Gates Scholarship Program
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.questbridge.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    QuestBridge College Prep
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Online Learning Platforms
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.codecademy.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Codecademy - Interactive Lessons
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.khanacademy.org/computing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Khan Academy CS
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.freecodecamp.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    freeCodeCamp
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.coursera.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Coursera CS Courses
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-green-100 dark:bg-green-900 border border-green-500 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
              Tips for Success
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  How to Apply
                </h4>
                <ul className="space-y-2 text-green-700 dark:text-green-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Start early - many programs have early deadlines</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Build a strong portfolio with personal projects</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Get involved in coding clubs and competitions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Ask teachers for recommendation letters</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  Making the Most of Opportunities
                </h4>
                <ul className="space-y-2 text-green-700 dark:text-green-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Network with professionals and peers</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Document your learning and projects</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Seek mentorship from industry professionals</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                    <span>Use experiences to guide college applications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        
        {/* Study Resources */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            Study Resources & Documentation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Programming Languages
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://docs.python.org/3/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Python Official Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    JavaScript MDN Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="https://docs.oracle.com/javase/tutorial/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Java Tutorials
                  </a>
                </li>
                <li>
                  <a 
                    href="https://docs.microsoft.com/en-us/dotnet/csharp/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    C# Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Educational Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.edx.org/course/introduction-computer-science-mitx-6-00-1x-10" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    MIT Introduction to Computer Science
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.coursera.org/learn/cs-programming-java" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Princeton Computer Science Course
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.udacity.com/course/intro-to-computer-science--cs101" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Udacity CS101
                  </a>
                </li>
                <li>
                  <a 
                    href="https://pll.harvard.edu/course/cs50-introduction-computer-science" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Harvard CS50*
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Reddit Communities
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.reddit.com/r/compsci/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    r/compsci - Computer Science Discussion
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.reddit.com/r/programming/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    r/programming - Programming News & Discussion
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.reddit.com/r/learnprogramming/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    r/learnprogramming - Learning Resources
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.reddit.com/r/cscareerquestions/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    r/cscareerquestions - Career Advice
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.reddit.com/r/csMajors/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    r/csMajors - Computer Science Majors
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.reddit.com/r/ApplyingToCollege/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    r/ApplyingToCollege - Applying to College
                  </a> 
                </li>
    
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-8 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            Questions about opportunities? Talk to your computer science teacher or guidance counselor.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            These resources can help you advance your CS education and career prospects.
          </p>
        </div>
      </div>
    </div>
  );
}
