import React from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../Components/HomeComponents/HeroBanner';
import About from '../../Components/HomeComponents/About';
import CardSlider from '../../Components/HomeComponents/CardSlider';
import RecipientsRequestForm from '../../Components/HomeComponents/RecipientsRequestForm';

const Home = () => {
  return (
    <div className="bg-white">
      <HeroBanner />
      
      <About />
      
      <CardSlider />

      {/* Request Help Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm">Need Assistance?</h2>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
              Submit a Request
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              If you or someone you know needs medical or financial assistance, please fill out the form below.
            </p>
          </div>
          <RecipientsRequestForm />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm">Testimonials</h2>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
              Voices of Impact
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="GiveAd helped me find the resources I needed when I had nowhere else to turn. Their support changed my life."
              author="Sarah Johnson"
              role="Beneficiary"
            />
            <TestimonialCard 
              quote="I've been donating for years, and seeing the direct impact of my contributions is incredibly rewarding. Highly transparent!"
              author="Michael Chen"
              role="Regular Donor"
            />
            <TestimonialCard 
              quote="The platform makes it so easy to connect with causes that matter. I'm proud to be part of this community."
              author="Emily Davis"
              role="Volunteer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl font-heading">
            Ready to Make a Difference?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Join thousands of others who are helping to change the world, one donation at a time.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#causes"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg transition-all duration-300 shadow-lg"
            >
              Start Donating
            </a>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
      </section>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 relative">
    <svg className="absolute top-6 left-6 w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21L14.017 18C14.017 16.0547 15.3738 15.122 15.9141 14.8733C15.9141 14.8733 16.6044 14.5522 16.6044 13.3497V11.7512C16.6044 11.4242 16.3642 11.16 16.0373 11.16H14.017C13.4647 11.16 13.017 10.7123 13.017 10.16V4.16C13.017 3.60771 13.4647 3.16 14.017 3.16H19.017C19.5693 3.16 20.017 3.60771 20.017 4.16V13.5197C20.017 15.845 18.118 17.5596 16.8075 18.5177C15.8912 19.1871 14.017 21 14.017 21ZM6.01697 21L6.01697 18C6.01697 16.0547 7.37376 15.122 7.91406 14.8733C7.91406 14.8733 8.60439 14.5522 8.60439 13.3497V11.7512C8.60439 11.4242 8.36421 11.16 8.03725 11.16H6.01697C5.46468 11.16 5.01697 10.7123 5.01697 10.16V4.16C5.01697 3.60771 5.46468 3.16 6.01697 3.16H11.017C11.5693 3.16 12.017 3.60771 12.017 4.16V13.5197C12.017 15.845 10.118 17.5596 8.80748 18.5177C7.8912 19.1871 6.01697 21 6.01697 21Z" />
    </svg>
    <p className="mt-6 text-gray-600 italic relative z-10">{quote}</p>
    <div className="mt-6 flex items-center">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold shadow-sm">
        {author[0]}
      </div>
      <div className="ml-3">
        <p className="text-sm font-bold text-gray-900">{author}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

export default Home;

