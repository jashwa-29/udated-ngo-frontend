import React, { useState } from 'react';
import { 
  HeartIcon, 
  LightBulbIcon, 
  ShieldCheckIcon, 
  ArrowLongRightIcon,
  UsersIcon,
  ChartBarIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-16 mt-6">
      <div className=" mx-auto">
        {/* Hero Section with Animation */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block bg-indigo-100 text-[#0B8B68] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Transforming Philanthropy
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Where <span className="text-[#0B8B68]">Generosity</span> Meets <span className="text-[#0B8B68]">Visibility</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A revolutionary platform that empowers donors while creating sustainable impact for communities in need.
          </p>
        </div>

        {/* Interactive Tabs Section */}
        <div className="mb-20">
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'mission' ? 'bg-[#0B8B68] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'story' ? 'bg-[#0B8B68] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'team' ? 'bg-[#0B8B68] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Our Team
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {activeTab === 'mission' && (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Redefining Giving</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    At <span className="font-semibold text-[#0B8B68]">GiveAd</span>, we've created a new model for philanthropy that benefits both donors and recipients. Our platform turns every donation into an opportunity for visibility and connection.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <SparklesIcon className="w-5 h-5 text-[#0B8B68] mt-1 mr-3" />
                      <span>Transparent donation tracking</span>
                    </li>
                    <li className="flex items-start">
                      <SparklesIcon className="w-5 h-5 text-[#0B8B68] mt-1 mr-3" />
                      <span>Verified recipient profiles</span>
                    </li>
                    <li className="flex items-start">
                      <SparklesIcon className="w-5 h-5 text-[#0B8B68] mt-1 mr-3" />
                      <span>Customizable donor recognition</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <div className="relative h-80 bg-indigo-100 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="Community support" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative h-80 bg-indigo-100 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="Our team" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Founded in 2020, GiveAd began as a small initiative to connect local businesses with families in need during the pandemic. Today, we've grown into a global platform facilitating millions in donations annually.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-indigo-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#0B8B68]">50K+</div>
                      <div className="text-sm text-gray-600">Donations</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#0B8B68]">120+</div>
                      <div className="text-sm text-gray-600">Communities</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#0B8B68]">$10M+</div>
                      <div className="text-sm text-gray-600">Raised</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: 'Sarah Johnson', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                    { name: 'Michael Chen', role: 'CTO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                    { name: 'Priya Patel', role: 'Community Director', img: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                  ].map((member, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                        <p className="text-[#0B8B68] mb-4">{member.role}</p>
                        <div className="flex space-x-4">
                          <button className="text-[#0B8B68] hover:text-indigo-800">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your contributions create real change in communities worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <GlobeAltIcon className="w-8 h-8 text-[#0B8B68]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Global Reach</h3>
              </div>
              <p className="text-gray-600 mb-6">
                We operate in 12 countries across 3 continents, with local teams ensuring donations reach those who need them most.
              </p>
              <div className="h-48 bg-indigo-50 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">World Map Visualization</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <ChartBarIcon className="w-8 h-8 text-[#0B8B68]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">By The Numbers</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '95%', label: 'Funds to causes' },
                  { value: '4.8★', label: 'Donor satisfaction' },
                  { value: '24h', label: 'Verification time' },
                  { value: '10K+', label: 'Lives impacted' },
                ].map((stat, index) => (
                  <div key={index} className="bg-indigo-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#0B8B68]">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our donors and recipients about their experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "As a small business, this platform lets us give back while getting visibility we couldn't afford otherwise.",
                name: "Jamie Rivera",
                role: "Small Business Owner"
              },
              {
                quote: "The transparency is unmatched. I can see exactly where my donation went and the impact it made.",
                name: "Dr. Alan Park",
                role: "Regular Donor"
              },
              {
                quote: "This support helped my family through our toughest time. We're forever grateful.",
                name: "Maria Gonzalez",
                role: "Recipient"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <div className="text-[#0B8B68] text-4xl leading-none">"</div>
                  <p className="text-gray-600 italic">{testimonial.quote}</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full mr-4"></div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section - Enhanced */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple three-step process makes giving rewarding for everyone
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-indigo-100 transform -translate-y-1/2"></div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {[
                {
                  icon: LightBulbIcon,
                  title: "1. Donate & Advertise",
                  description: "Contribute to a cause and post your message that appears on our platform",
                  color: "bg-indigo-100 text-[#0B8B68]"
                },
                {
                  icon: HeartIcon,
                  title: "2. Funds Reach the Needy",
                  description: "Your donation goes directly to verified individuals through our transparent process",
                  color: "bg-pink-100 text-[#0B8B68]"
                },
                {
                  icon: UsersIcon,
                  title: "3. Community Engagement",
                  description: "Visitors see your ad, learn about the cause, and can join the movement",
                  color: "bg-blue-100 text-[#0B8B68]"
                }
              ].map((step, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                  <div className={`${step.color} w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section - Enhanced */}
        <div className="bg-[#0B8B68] rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of donors and businesses creating real change while growing their visibility
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-[#0B8B68] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center">
                Start Donating <ArrowLongRightIcon className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-[#0B8B68] transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;