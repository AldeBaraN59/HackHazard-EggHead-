import React from 'react';

const TierCards = () => {
  return (
    <div className="max-w-[300px] w-full pt-10 px-10 pb-8 bg-gray-900 rounded-3xl">
      <div className="text-center mb-6">
        <h5 className="text-2xl font-semibold text-white mb-3">Deluxe</h5>
        <span className="block text-5xl font-bold text-white mb-3">$20</span>
        <span className="block text-gray-300 font-medium mb-6">per user, per month</span>
        <a className="relative group inline-block w-full py-4 px-6 text-center text-gray-50 hover:text-gray-900 bg-yellow-600 font-semibold rounded-full overflow-hidden transition duration-200" href="#">
          <div className="absolute top-0 right-full w-full h-full bg-white transform group-hover:translate-x-full group-hover:scale-102 transition duration-500" />
          <span className="relative">Start 7-days Trial</span>
        </a>
      </div>
      <ul>
        <li className="flex mb-4 items-center">
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
          </svg>
          <span className="ml-2 text-white">Unlimited Features</span>
        </li>
        <li className="flex mb-4 items-center">
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
          </svg>
          <span className="ml-2 text-white">Enhanced Security</span>
        </li>
        <li className="flex mb-4 items-center">
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
          </svg>
          <span className="ml-2 text-white">Priority Support</span>
        </li>
        <li className="flex mb-4 items-center">
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
          </svg>
          <span className="ml-2 text-white">Exclusive Access</span>
        </li>
        <li className="flex mb-4 items-center">
          <svg className="w-6 h-6 fill-current text-gray-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
          </svg>
          <span className="ml-2 text-gray-500 line-through">Ad-free Experience</span>
        </li>
        <li className="flex items-center">
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
          </svg>
          <span className="ml-2 text-white">Customization Options</span>
        </li>
      </ul>
    </div>
  );
}

export default TierCards;
