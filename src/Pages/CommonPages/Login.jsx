import React from 'react';
import { Link } from 'react-router-dom';

const loginOptions = [
  {
    title: 'Admin Login',
    route: '/login/admin-login',
  },
  {
    title: 'Recipients Login',
    route: '/login/recipients-login',
  },
  {
    title: 'Donor Login',
    route: '/login/donor-login',
  },
];

const Login = () => {
  return (
    <section className='px-4 mx-auto sm:px-6 lg:px-16 my-8'>
      <h1 className='text-center mt-9 text-3xl font-semibold mb-9'>Login</h1>

      <div className='flex justify-evenly items-center flex-wrap gap-6 px-4'>
        {loginOptions.map((option, index) => (
          <Link
            key={index}
            to={option.route}
            className='flex flex-col justify-center items-center w-[300px]'
          >
            <div className='w-full h-[300px] shadow-lg border border-gray-200 flex justify-center items-center rounded mb-4 transition hover:shadow-2xl'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='61'
                height='60'
                viewBox='0 0 61 60'
                fill='none'
              >
                <path
                  d='M2 51.375C2 47.5957 3.50133 43.9711 6.17373 41.2987C8.84612 38.6263 12.4707 37.125 16.25 37.125H44.75C48.5293 37.125 52.1539 38.6263 54.8263 41.2987C57.4987 43.9711 59 47.5957 59 51.375C59 53.2647 58.2493 55.0769 56.9131 56.4131C55.5769 57.7493 53.7647 58.5 51.875 58.5H9.125C7.23533 58.5 5.42306 57.7493 4.08686 56.4131C2.75067 55.0769 2 53.2647 2 51.375Z'
                  stroke='black'
                  strokeWidth='2.5'
                  strokeLinejoin='round'
                />
                <path
                  d='M30.5 22.875C36.4025 22.875 41.1875 18.09 41.1875 12.1875C41.1875 6.28496 36.4025 1.5 30.5 1.5C24.5975 1.5 19.8125 6.28496 19.8125 12.1875C19.8125 18.09 24.5975 22.875 30.5 22.875Z'
                  stroke='black'
                  strokeWidth='2.5'
                />
              </svg>
            </div>
            <h2 className='font-semibold text-2xl'>{option.title}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Login;
