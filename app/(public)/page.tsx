"use client";

import Hero from "./(home)/hero";
import About from "./(home)/about";
import VerticalTiles from "@/components/animata/preloader/vertical-tiles";
import StackedSections from "@/components/StackedSections";

export default function page() {
  return (
    <>
      {/* <VerticalTiles> */}
      <StackedSections>
        <Hero />
        <About />
      </StackedSections>
      {/* </VerticalTiles> */}
    </>
  );
}
