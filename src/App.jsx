import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import Navbar from "./components/NavBar";
import About from "./sections/About";
import HowIBuild from "./sections/HowIBuild";

const App = () => (
  <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Navbar />
    <main id="main-content">
      <Hero />
      <ShowcaseSection />
      <About />
      <HowIBuild />
      <TechStack />
      <Contact />
    </main>
    <Footer />
  </>
);

export default App;
