import React from 'react';
import { Link } from 'react-router-dom';

const loginOptions = [
  // {
  //   title: 'Admin Login',
  //   route: '/admin-login',
  // },
  {
    title: 'Recipients Login',
    route: '/recipients-login',
  },
  {
    title: 'Donor Login',
    route: '/donor-login',
  },
];

const Login = () => {
  return (
    <section className='pt-28 lg:pt-36 pb-10 px-4 mx-auto sm:px-6 lg:px-16 min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white'>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4D9186] to-[#3d7a70]'>
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Please select your portal to continue. Your journey of making a difference starts here.
          </p>
        </div>

        <div className='flex justify-center items-stretch flex-wrap gap-8 px-4'>
          {loginOptions.map((option, index) => (
            <Link
              key={index}
              to={option.route}
              className='group flex flex-col items-center w-full sm:w-[320px] transition-all duration-300'
            >
              <div className='w-full aspect-square bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col justify-center items-center rounded-3xl mb-6 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(77,145,134,0.15)] group-hover:-translate-y-2 group-hover:bg-white overflow-hidden relative'>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4D9186]/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                
                <div className="relative z-10 p-8 rounded-2xl bg-[#4D9186]/5 mb-6 group-hover:bg-[#4D9186] transition-colors duration-300">
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='48'
                    height='48'
                    viewBox='0 0 61 60'
                    fill='none'
                    className="group-hover:stroke-white transition-colors duration-300"
                  >
                    <path
                      d='M2 51.375C2 47.5957 3.50133 43.9711 6.17373 41.2987C8.84612 38.6263 12.4707 37.125 16.25 37.125H44.75C48.5293 37.125 52.1539 38.6263 54.8263 41.2987C57.4987 43.9711 59 47.5957 59 51.375C59 53.2647 58.2493 55.0769 56.9131 56.4131C55.5769 57.7493 53.7647 58.5 51.875 58.5H9.125C7.23533 58.5 5.42306 57.7493 4.08686 56.4131C2.75067 55.0769 2 53.2647 2 51.375Z'
                      stroke='#4D9186'
                      strokeWidth='2.5'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M30.5 22.875C36.4025 22.875 41.1875 18.09 41.1875 12.1875C41.1875 6.28496 36.4025 1.5 30.5 1.5C24.5975 1.5 19.8125 6.28496 19.8125 12.1875C19.8125 18.09 24.5975 22.875 30.5 22.875Z'
                      stroke='#4D9186'
                      strokeWidth='2.5'
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4D9186] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
              <h2 className='font-bold text-xl text-gray-800 group-hover:text-[#4D9186] transition-colors duration-300'>{option.title}</h2>
              <div className="mt-2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to login &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Login;
