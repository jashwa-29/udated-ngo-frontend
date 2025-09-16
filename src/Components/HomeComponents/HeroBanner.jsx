import React, { useState } from 'react';
import img1 from '../../assets/image.png'
import img2 from '../../assets/image (1).png'
import img3 from '../../assets/image 1.png'
import img4 from '../../assets/image (2).png'
import img5 from '../../assets/image (3).png'
import DonationModal from './DonationModal';
import LoginPromptModal from './LoginPromptModal';
import { useNavigate } from 'react-router-dom';

const images = [
  img1,
 img2,
 img3,
  img4,
 img5,
];
const HeroBanner = () => {

  return (
    <div className="bg-white mt-1 pt-5">
      <div className="max-w-7xl mx-auto text-center text-black">
        <h1 className="text-5xl md:text-5xl font-bold mb-6 mt-10  font-title ">
          Helping Each Other Can Make<br />
          <span className="">World Better</span>
        </h1>
        
        <p className="text-xl mb-10 leading-relaxed">
          We Seek Out World Changers And Difference Makers Around The<br />
          Globe And Equip Them To Fulfill Their Unique Purpose.
        </p>
        
        <a href='#card' className="hover:text-[#0B8B68] transition duration-300 bg-[#0B8B68] hover:bg-white border border-white hover:border-[#0B8B68] text-white font-medium rounded px-8 py-2.5">
          Donate Now
        </a>
      </div>

      <div className="max-w-7xl mx-auto mt-10 flex justify-center items-end gap-5 flex-wrap">
      {images.map((src, index) => {
        let heightClass = "h-100"; // default

        if (index === 1) heightClass = "h-85"; // 2nd image
        if (index === 2) heightClass = "h-60"; // 3rd image
        if (index === 3) heightClass = "h-85"; // 4th image 
        
          return (
        <div
            key={index}
            className={`w-60 ${heightClass} overflow-hidden rounded-2xl shadow-md bg-white`}
          >
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>);
})}
    </div>
   
    </div>
  );
};

export default HeroBanner;