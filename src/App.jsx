import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import Navbar from "./components/NavBar";
import About from "./sections/About";
import HowIBuild from "./sections/HowIBuild";
import WorldJourney from "./components/world/WorldJourney";

const App = () => (
  <WorldJourney>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Navbar />
    <main id="main-content" className="world-story">
      <Hero />
      <ShowcaseSection />
      <HowIBuild />
      <TechStack />
      <About />
      <Contact />
    </main>
    <Footer />
  </WorldJourney>
);

export default App;
