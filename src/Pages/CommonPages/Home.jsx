import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../Components/HomeComponents/HeroBanner';
import CardSlider from '../../Components/HomeComponents/CardSlider';
import RecipientsRequestForm from '../../Components/HomeComponents/RecipientsRequestForm';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  UsersIcon,
  ChartBarIcon,
  GlobeAltIcon,
  SparklesIcon,
  HandRaisedIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="bg-white">
      <HeroBanner />
      
      {/* Consolidated About/Mission Section */}
      <section id="about" className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Who We Are • Est. 2020
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading leading-tight">
              Making a Difference, <br />
              <span className="text-primary">One Life at a Time</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              We are dedicated to bridging the gap between compassionate donors and individuals in critical need, ensuring every contribution creates a lasting impact.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 mb-20">
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {['mission', 'story', 'team'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-6 px-8 text-center font-bold text-sm tracking-widest uppercase transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-primary border-b-4 border-primary bg-gray-50/50' 
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Our {tab}
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
                    <p className="text-lg text-gray-500 leading-relaxed">
                      Our mission is to create a transparent, efficient, and dignified ecosystem for giving. We believe that technology can transform how we help one another.
                    </p>
                    <div className="space-y-4 pt-4">
                      {[
                        { icon: ShieldCheckIcon, text: "100% Transparent Tracking" },
                        { icon: UsersIcon, text: "Direct-to-Beneficiary Support" },
                        { icon: HeartIcon, text: "Dignity-First Approach" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                          <div className="bg-white p-2 rounded-lg shadow-sm mr-4 text-primary">
                            <item.icon className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-gray-700 text-sm tracking-wide">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="relative h-[450px] rounded-[2rem] overflow-hidden shadow-2xl group">
                      <img 
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                        alt="Mission" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-70">Our Vision</p>
                        <p className="text-2xl font-heading font-black">A world where no call for help goes unanswered.</p>
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
                    <p className="text-lg text-gray-500 leading-relaxed">
                      Founded in 2020 during a global crisis, Giving is Divine began as a small community initiative to connect local businesses with families struggling to put food on the table.
                    </p>
                    <p className="text-lg text-gray-500 leading-relaxed">
                      What started with a few spreadsheets and phone calls has grown into a robust platform that has facilitated millions in aid. 
                    </p>
                    <div className="grid grid-cols-3 gap-6 pt-6">
                      {[
                        { label: "Donations", value: "50K+" },
                        { label: "Communities", value: "120+" },
                        { label: "Impact", value: "$10M+" }
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-3xl font-black text-primary tracking-tighter">{stat.value}</div>
                          <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="animate-fade-in">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">People Behind Purpose</h2>
                    <p className="text-gray-500">A diverse team of technologists, social workers, and dreamers united by a single goal.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { name: 'Sarah Johnson', role: 'Executive Director', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                      { name: 'Michael Chen', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                      { name: 'Priya Patel', role: 'Community Outreach', img: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
                    ].map((member, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-[2rem] shadow-lg bg-gray-50">
                        <img src={member.img} alt={member.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                          <h3 className="text-xl font-black text-white">{member.name}</h3>
                          <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <CardSlider />

      {/* Impact Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Our Impact</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-8 font-heading leading-tight">
                Real Change, <br />
                <span className="text-primary">Measurable Results</span>
              </h2>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-light">
                We believe in the power of data to drive social good. Every dollar donated is tracked, ensuring accountability and maximizing impact.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: GlobeAltIcon, label: "Countries Reached", value: "12" },
                  { icon: HandRaisedIcon, label: "Volunteers", value: "2,500+" },
                  { icon: ChartBarIcon, label: "Success Rate", value: "98%" },
                  { icon: SparklesIcon, label: "Lives Touched", value: "100K+" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-start space-x-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all">
                    <stat.icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
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
                className="relative rounded-[3rem] shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-900 rounded-[4rem] mx-4 my-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 text-white">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs inline-block mb-4">Our Process</span>
            <h2 className="text-4xl font-black mb-6 font-heading">How We Make a Difference</h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">Our transparent process ensures that your generosity reaches those who need it most, efficiently and effectively.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Identify & Verify",
                desc: "We work with local partners to identify genuine cases and verify every recipient's medical background.",
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
                desc: "We provide detailed impact reports and ensure long-term sustainability for our beneficiaries.",
                icon: ChartBarIcon,
                step: "03"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                <div className="absolute top-4 right-8 font-black text-6xl text-white/5 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 text-primary shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Help Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Need Assistance?</span>
            <h2 className="mt-4 text-4xl font-black text-gray-900 sm:text-5xl font-heading tracking-tight">
              Submit a Request
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto font-light leading-relaxed">
              If you or someone you know needs medical or financial assistance, please fill out the verified form below.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
             <RecipientsRequestForm />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Testimonials</span>
            <h2 className="mt-4 text-4xl font-black text-gray-900 sm:text-5xl font-heading tracking-tight">
              Voices of Impact
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
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
      
      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="bg-primary rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 font-heading leading-[0.9]">Be the Change <br/> You Want to See</h2>
            <p className="text-xl text-primary-50 mb-12 max-w-2xl mx-auto font-light">
              Join a community of changemakers. Whether you donate, volunteer, or spread the word, your action matters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/receivers" className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center group">
                Start Donating <ArrowLongRightIcon className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/contact" className="bg-primary-dark border border-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
                Partner With Us
              </Link>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-[100px]"></div>
        </div>
      </section>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative group hover:-translate-y-2 transition-all duration-500">
    <div className="absolute top-8 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
       <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21L14.017 18C14.017 16.0547 15.3738 15.122 15.9141 14.8733C15.9141 14.8733 16.6044 14.5522 16.6044 13.3497V11.7512C16.6044 11.4242 16.3642 11.16 16.0373 11.16H14.017C13.4647 11.16 13.017 10.7123 13.017 10.16V4.16C13.017 3.60771 13.4647 3.16 14.017 3.16H19.017C19.5693 3.16 20.017 3.60771 20.017 4.16V13.5197C20.017 15.845 18.118 17.5596 16.8075 18.5177C15.8912 19.1871 14.017 21 14.017 21ZM6.01697 21L6.01697 18C6.01697 16.0547 7.37376 15.122 7.91406 14.8733C7.91406 14.8733 8.60439 14.5522 8.60439 13.3497V11.7512C8.60439 11.4242 8.36421 11.16 8.03725 11.16H6.01697C5.46468 11.16 5.01697 10.7123 5.01697 10.16V4.16C5.01697 3.60771 5.46468 3.16 6.01697 3.16H11.017C11.5693 3.16 12.017 3.60771 12.017 4.16V13.5197C12.017 15.845 10.118 17.5596 8.80748 18.5177C7.8912 19.1871 6.01697 21 6.01697 21Z" />
       </svg>
    </div>
    <p className="text-xl text-gray-600 font-medium italic leading-relaxed mb-8">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black shadow-inner border border-primary/20">
        {author[0]}
      </div>
      <div className="ml-4">
        <p className="text-sm font-black text-gray-900 uppercase tracking-widest">{author}</p>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{role}</p>
      </div>
    </div>
  </div>
);

export default Home;

