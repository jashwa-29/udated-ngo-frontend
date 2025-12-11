import React from 'react';
import img1 from '../../assets/image.png'
import img2 from '../../assets/image (1).png'
import img3 from '../../assets/image 1.png'
import img4 from '../../assets/image (2).png'
import img5 from '../../assets/image (3).png'

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
];

const HeroBanner = () => {
  return (
    <div className="bg-white pt-28 lg:pt-36 pb-10">
      <div className="max-w-7xl mx-auto text-center text-black px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
          Helping Each Other Can Make<br />
          <span className="text-primary">World Better</span>
        </h1>
        
        <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-600">
          We Seek Out World Changers And Difference Makers Around The<br className="hidden md:block" />
          Globe And Equip Them To Fulfill Their Unique Purpose.
        </p>
        
        <a href='#card' className="inline-block hover:text-primary transition duration-300 bg-primary hover:bg-white border border-white hover:border-primary text-white font-medium rounded px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Donate Now
        </a>
      </div>

      <div className="max-w-7xl mx-auto mt-12 flex justify-center items-end gap-4 md:gap-6 flex-wrap px-4">
        {images.map((src, index) => {
          // Responsive heights matching the visual rhythm of the original design
          let heightClass = "h-64 md:h-96"; // default (tallest)

          if (index === 1) heightClass = "h-48 md:h-80"; // 2nd image
          if (index === 2) heightClass = "h-32 md:h-60"; // 3rd image (shortest, middle)
          if (index === 3) heightClass = "h-48 md:h-80"; // 4th image 
          
          return (
            <div
              key={index}
              className={`w-32 md:w-48 lg:w-56 ${heightClass} overflow-hidden rounded-2xl shadow-md bg-white transition-all duration-300 hover:shadow-xl`}
            >
              <img
                src={src}
                alt={`Hero gallery ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroBanner;