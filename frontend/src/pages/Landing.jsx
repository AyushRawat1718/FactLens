import React from "react";
import Hero from "../sections/Hero.jsx";
import Overview from "../sections/Overview.jsx";
import Demo from "../sections/Demo.jsx";
import Limitations from "../sections/Limitations.jsx";
import Why from "../sections/Why.jsx";
import HowItWorks from "../sections/HowItWorks.jsx";
import Architecture from "../sections/Architecture.jsx";
import ModelEvaluation from "../sections/ModelEvaluation.jsx";
import TechStack from "../sections/TechStack.jsx";
import BuiltWith from "../sections/BuiltWith.jsx";
import Trust from "../sections/Trust.jsx";
import CTA from "../sections/CTA.jsx";

export default function Landing() {
  return (
    <>
      <Hero />
      <Overview />
      <Demo />
      <Limitations />
      <Why />
      <HowItWorks />
      <Architecture />
      <ModelEvaluation />
      <TechStack />
      <BuiltWith />
      <Trust />
      <CTA />
    </>
  );
}
