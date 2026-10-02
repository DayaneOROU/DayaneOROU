"use client";

import Hero from "./(home)/hero";
import About from "./(home)/about";
import Projects from './(home)/projects'
import VerticalTiles from "@/components/animata/preloader/vertical-tiles";
import StackedSections from "@/components/StackedSections";
import { ContactForm } from "./(home)/ContactForm";

export default function page() {
  return (
    <>
      {/* <VerticalTiles> */}
      <StackedSections>
        <Hero />
        <About />
      </StackedSections>
      {/* <ContactForm /> */}
      {/* <Projects/> */}
      
      {/* </VerticalTiles> */}
    </>
  );
}
