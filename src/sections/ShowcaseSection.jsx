import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const propControlRef = useRef(null);
  const voiceOpsRef = useRef(null);
  const visionOpsRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 });

    const cards = [propControlRef.current, voiceOpsRef.current, visionOpsRef.current];
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: { trigger: card, start: "top bottom-=100" },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={propControlRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <img src="/images/project1.png" alt="Project showcase artwork" />
            </div>
            <div className="text-content">
              <h2>PropControl — AI-Powered Real Estate Operations</h2>
              <p className="text-white-50 md:text-xl">
                A property-operations system connecting work orders, maintenance, inspections, projects, follow-ups, vendors, and owner approvals.
              </p>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={voiceOpsRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <img src="/images/project2.png" alt="Project showcase artwork" />
              </div>
              <h2>VoiceOps — AI Voice for Real Estate Operations</h2>
            </div>

            <div className="project" ref={visionOpsRef}>
              <div className="image-wrapper bg-[#FFE7EB]">
                <img src="/images/project3.png" alt="Project showcase artwork" />
              </div>
              <h2>VisionOps — AI Inspections & Repair Intelligence</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
