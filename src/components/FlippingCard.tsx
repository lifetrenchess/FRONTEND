import React from 'react';

interface FlippingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FlippingCard: React.FC<FlippingCardProps> = ({ icon, title, description }) => {
  return (
    <div className="[perspective:1000px]">
      <div className="relative w-full h-64 transition-transform duration-500 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
        {/* Front Side */}
        <div className="absolute inset-0 bg-white/80 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
          <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-palette-cream">
            {/* Force icon to be centered and same size for all */}
            <span className="flex items-center justify-center w-10 h-10">
              {icon}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{title}</h3>
        </div>
        {/* Back Side */}
        <div className="absolute inset-0 bg-white/90 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-gray-700 text-center leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard; 