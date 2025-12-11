import React, { useState } from 'react';
import { 
  HeartIcon, 
  LightBulbIcon, 
  ShieldCheckIcon, 
  ArrowLongRightIcon,
  UsersIcon,
  ChartBarIcon,
  GlobeAltIcon,
  SparklesIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Est. 2020 • Non-Profit Organization
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading leading-tight">
            Empowering Lives, <br />
            <span className="text-white/90">Building Futures</span>
          </h1>
          <p className="text-xl text-indigo-50 max-w-2xl mx-auto font-light leading-relaxed">
            We are dedicated to bridging the gap between compassionate donors and individuals in critical need, ensuring every contribution creates a lasting impact.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Interactive Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {['mission', 'story', 'team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-6 px-8 text-center font-semibold text-lg transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-primary border-b-4 border-primary bg-gray-50/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Our {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12 lg:p-16">
            {activeTab === 'mission' && (
              <div className="flex flex-col md:flex-row items-center gap-12 animate-fade-in">
                <div className="md:w-1/2 space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 font-heading">
                    Redefining <span className="text-primary">Philanthropy</span>
                  </h2>
                  <p className="text-lg text-secondary leading-relaxed">
                    At <span className="font-semibold text-primary">GiveAd</span>, our mission is simple yet profound: to create a transparent, efficient, and dignified ecosystem for giving. We believe that technology can transform how we help one another.
                  </p>
                  <div className="space-y-4 pt-4">
                    {[
                      { icon: ShieldCheckIcon, text: "100% Transparent Donation Tracking" },
                      { icon: UsersIcon, text: "Direct-to-Beneficiary Support" },
                      { icon: HeartIcon, text: "Dignity-First Approach" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                        <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-medium text-gray-800">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Mission" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-sm font-medium uppercase tracking-wider mb-2">Our Vision</p>
                      <p className="text-2xl font-heading font-bold">A world where no call for help goes unanswered.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="flex flex-col md:flex-row items-center gap-12 animate-fade-in">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="grid grid-cols-2 gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      className="rounded-2xl shadow-lg w-full h-64 object-cover mb-8"
                      alt="Early days"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                      alt="Community work"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 font-heading">From a Spark to a <span className="text-primary">Movement</span></h2>
                  <p className="text-lg text-secondary leading-relaxed">
                    Founded in 2020 during a global crisis, GiveAd began as a small community initiative to connect local businesses with families struggling to put food on the table.
                  </p>
                  <p className="text-lg text-secondary leading-relaxed">
                    What started with a few spreadsheets and phone calls has grown into a robust platform that has facilitated millions in aid. Yet, our core belief remains unchanged: <strong>compassion is contagious.</strong>
                  </p>
                  <div className="grid grid-cols-3 gap-6 pt-6">
                    {[
                      { label: "Donations", value: "50K+" },
                      { label: "Communities", value: "120+" },
                      { label: "Impact", value: "$10M+" }
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-3xl font-bold text-primary font-heading">{stat.value}</div>
                        <div className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="animate-fade-in">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">The People Behind the Purpose</h2>
                  <p className="text-secondary">A diverse team of technologists, social workers, and dreamers united by a single goal.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: 'Sarah Johnson', role: 'Founder & Executive Director', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                    { name: 'Michael Chen', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                    { name: 'Priya Patel', role: 'Community Outreach Lead', img: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                  ].map((member, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg bg-white">
                      <div className="aspect-w-3 aspect-h-4">
                        <img src={member.img} alt={member.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-primary-light text-sm font-medium">{member.role}</p>
                      </div>
                      <div className="p-6 bg-white group-hover:hidden">
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-primary text-sm">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Impact Stats Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">Our Impact</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6 font-heading">
                Real Change, <br />
                <span className="text-primary">Measurable Results</span>
              </h2>
              <p className="text-lg text-secondary mb-8 leading-relaxed">
                We believe in the power of data to drive social good. Every dollar donated is tracked, ensuring accountability and maximizing the impact on the ground.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: GlobeAltIcon, label: "Countries Reached", value: "12" },
                  { icon: HandRaisedIcon, label: "Volunteers", value: "2,500+" },
                  { icon: ChartBarIcon, label: "Success Rate", value: "98%" },
                  { icon: SparklesIcon, label: "Lives Touched", value: "100K+" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50/50 transition-colors">
                    <stat.icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Impact Map" 
                className="relative rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values / How It Works */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">How We Make a Difference</h2>
            <p className="text-lg text-secondary">Our transparent process ensures that your generosity reaches those who need it most, efficiently and effectively.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Identify & Verify",
                desc: "We work with local partners to identify genuine cases and verify every recipient's background.",
                icon: ShieldCheckIcon,
                step: "01"
              },
              {
                title: "Connect & Fund",
                desc: "Donors browse verified profiles and contribute directly. No middlemen, no hidden fees.",
                icon: HeartIcon,
                step: "02"
              },
              {
                title: "Report & Sustain",
                desc: "We provide detailed impact reports and ensure long-term sustainability for beneficiaries.",
                icon: ChartBarIcon,
                step: "03"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-bold font-heading text-primary group-hover:opacity-20 transition-opacity">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">Be the Change You Want to See</h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Join a community of changemakers. Whether you donate, volunteer, or spread the word, your action matters.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/receivers" className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center">
                  Start Donating <ArrowLongRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/contact" className="bg-primary-dark border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark/80 transition-colors">
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;