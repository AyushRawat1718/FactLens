import React from "react";
import Hero from "../sections/Hero.jsx";
import Demo from "../sections/Demo.jsx";
import Why from "../sections/Why.jsx";
import HowItWorks from "../sections/HowItWorks.jsx";
import Architecture from "../sections/Architecture.jsx";
import TechStack from "../sections/TechStack.jsx";
import Trust from "../sections/Trust.jsx";
import CTA from "../sections/CTA.jsx";

export default function Landing() {
  return (
    <>
      <Hero />
      <Demo />
      <Why />
      <HowItWorks />
      <Architecture />
      <TechStack />
      <Trust />
      <CTA />
    </>
  );
}
