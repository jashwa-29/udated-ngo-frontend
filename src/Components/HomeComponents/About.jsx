import React from "react";
import img1 from "../../assets/Rectangle 6.png";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto  mt-20">
      <div className="grid md:grid-cols-2 gap-5 p-5 md:p-0">
        <div className="">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Learn About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto justify">
            At Ddsgm Auto Repair, our mission is to provide our customers with
            the highest level of car care and customer service. At Ddsgm Auto
            Repair, our mission is to provide our customers with the highest
            level of car care and customer service. At Ddsgm Auto Repair, our
            mission is to provide our customers with the highest level of car
            care and customer service.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-10 mb-16">
            <div className="">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-gray-600">
                    At Ddsgm Auto Repair, our mission is to provide our
                    customers with the highest level of car care and customer
                    service.
                  </span>
                </li>
              </ul>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-gray-600">
                    At Ddsgm Auto Repair, our technicians are the heart and soul
                    of our business. With years of experience and training.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <StatCard number="5+" title="Years Experience" />
            <StatCard number="300+" title="Donors" />
            <StatCard number="300+" title="Recipients" />
          </div>
        </div>

        <div className="mt-16">
          <img src={img1} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-20 p-5 md:p-0">
        <div className="">
          <h2 className="text-2xl md:text-4xl font-medium">Our Founder</h2>
          <img className="mt-5" src={img1} />
        </div>

        <div className="mt-0 md:mt-20">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
            Name
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto justify">
            At Ddsgm Auto Repair, our mission is to provide our customers with
            the highest level of car care and customer service. At Ddsgm Auto
            Repair, our mission is to provide our customers with the highest
            level of car care and customer service. At Ddsgm Auto Repair, our
            mission is to provide our customers with the highest level of car
            care and customer service.
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({ number, title }) => {
  return (
    <div className="bg-white text-center md:text-left p-5 md:p-0 hover:shadow-lg transition-shadow">
      <h3 className="text-4xl font-bold text-black mb-2">{number}</h3>
      <p className="text-gray-700 font-medium">{title}</p>
    </div>
  );
};

export default About;
