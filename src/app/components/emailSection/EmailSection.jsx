"use client";
import React, { useState } from "react";
import GithubIcon from "../../../../public/images/github-icon.svg";
import LinkedinIcon from "../../../../public/images/linkedin-icon.svg";
import InstagramIcon from "../../../../public/images/instagram/icons8-instagram-48.svg"; 
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const itemVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

const EmailSection = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/send";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const resData = await response.json();

    if (response.ok) {
      console.log("Message sent.");
      setEmailSubmitted(true);
    } else {
      console.error("Failed to send message:", resData.message);
      setEmailSubmitted(false);
    }
  };

  return (
    <section
      id="contact"
      className="grid grid-cols-1 md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative "
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-900 to-transparent rounded-full top-3/4 h-80 w-80 z-0 blur-lg absolute transform -translate-x-1/2 -translate-1/2 animate-pulse"></div>
      <div className="z-0">
        <motion.h5
          variants={itemVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-xl font-bold text-white my-2"
        >
          Let&apos;s Connect
        </motion.h5>
        <motion.p
          variants={itemVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="text-[#ADB7BE] mb-4 max-w-md"
        >
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </motion.p>
        <motion.div
          variants={itemVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="socials flex flex-row gap-6"
        >
          <Link href="https://github.com/kyy-95631488">
            <Image
              src={GithubIcon}
              alt="Github Icon"
              className="bg-secondary-700 border rounded-xl border-transparent"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/hendriansyah-rizky-setiawan-8b4a68308/">
            <Image
              src={LinkedinIcon}
              alt="Linkedin Icon"
              className="bg-secondary-700 border rounded-xl border-transparent"
            />
          </Link>
          <Link href="https://www.instagram.com/cerberus404x/">
            <Image
              src={InstagramIcon}
              alt="Instagram Icon"
              className="bg-secondary-700 border rounded-xl border-transparent"
            />
          </Link>
        </motion.div>
      </div>
      <div className="mb-6">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-6">
            <motion.label
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              htmlFor="email"
              className="text-white block text-sm font-medium mb-2"
            >
              Your Email
            </motion.label>
            <motion.input
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              type="email"
              name="email"
              id="email"
              required
              placeholder="email@example.com"
            />
          </div>
          <div className="mb-6">
            <motion.label
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              htmlFor="subject"
              className="text-white block mb-2 text-sm font-medium"
            >
              Subject
            </motion.label>
            <motion.input
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              type="text"
              name="subject"
              id="subject"
              required
              placeholder="Just saying Hi!!!"
            />
          </div>
          <div className="mb-6">
            <motion.label
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              htmlFor="message"
              className="text-white block text-sm font-medium mb-2"
            >
              Message
            </motion.label>
            <motion.textarea
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              name="message"
              id="message"
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Hi Friends, Let's talk about......"
            />
          </div>
          <motion.button
            variants={itemVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            type="submit"
            className="bg-secondary-500 hover:bg-secondary-700 border border-[#33353F] hover:border-white text-white text-sm font-medium rounded-lg py-2.5 px-5 w-full"
          >
            Send Message
          </motion.button>
          {emailSubmitted && (
            <motion.p
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ delay: 0.1 }}
              className="text-secondary-500 text-sm mt-2 animate-pulse"
            >
              Email sent successfully!
            </motion.p>
          )}
        </form>
      </div>
    </section>
  );
};

export default EmailSection;
