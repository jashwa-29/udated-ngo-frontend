import React from "react";
import { Link } from "react-router-dom";
import img1 from "../../assets/Rectangle 6.png";

const About = () => {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="order-2 lg:order-1">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Who We Are</h2>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
              Making a Difference, <br />
              <span className="text-primary">One Life at a Time</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              At GiveAd, we believe that everyone deserves a chance to live a dignified life. We are a community of changemakers dedicated to bridging the gap between those who want to help and those who need it most.
            </p>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
                <p className="mt-2 text-gray-600 text-sm">To empower individuals and communities by providing access to essential resources and support.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Our Vision</h3>
                <p className="mt-2 text-gray-600 text-sm">A world where compassion drives action and every person has the opportunity to thrive.</p>
              </div>
            </div>

            <div className="mt-10">
              <Link to="/about" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-2 group">
                Read our full story 
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={img1} alt="Volunteers helping" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-3xl font-bold">10k+</p>
                  <p className="text-sm opacity-90">Lives Impacted Globally</p>
                </div>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-dots-pattern opacity-20 hidden lg:block"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/10 rounded-full -z-10 hidden lg:block"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-10">
          <StatCard number="5+" title="Years of Service" />
          <StatCard number="50+" title="Active Volunteers" />
          <StatCard number="300+" title="Donors Worldwide" />
          <StatCard number="₹1M+" title="Funds Raised" />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ number, title }) => {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{number}</p>
      <p className="text-sm md:text-base text-gray-600 font-medium">{title}</p>
    </div>
  );
};

export default About;

