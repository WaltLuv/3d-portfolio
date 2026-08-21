import { testimonials } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

const Testimonials = () => {
  return (
    <section id="testimonials" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="How I Build" sub="From real workflows to useful AI systems" />

        <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
          {testimonials.map((item, index) => (
            <GlowCard card={item} key={item.name} index={index}>
              <div className="flex items-center gap-3">
                <div>
                  <img src={item.imgPath} alt="" className="size-10" />
                </div>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-white-50">{item.mentions}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
