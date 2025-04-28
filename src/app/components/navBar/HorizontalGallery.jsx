/* eslint-disable @next/next/no-img-element */
import React from "react";
import { motion } from "framer-motion";

const HorizontalGallery = ({ imageArray }) => {
  const itemVariants = {
    initial: { x: "-100vw", opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };

  return (
    <div className="w-full flex justify-center overflow-x-auto scrollbar-hide">
      <ul className="flex justify-center items-center space-x-4 px-4 py-2">
        {imageArray.map((image, i) => (
          <motion.li
            key={image.id}
            className="flex flex-col items-center min-w-[60px] group"
            variants={itemVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, delay: i * 0.08 }}
          >
            <span className="text-[10px] mb-1 uppercase opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-300 font-medium text-center">
              {image.alt || `Image ${image.id}`}
            </span>
            <img
              src={image.url}
              alt={image.alt || `Image ${image.id}`}
              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default HorizontalGallery;
