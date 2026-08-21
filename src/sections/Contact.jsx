import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import ContactExperience from "../components/models/contact/ContactExperience";

const emailConfigured = Boolean(
  import.meta.env.VITE_APP_EMAILJS_SERVICE_ID &&
  import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID &&
  import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
);

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailConfigured) return;
    setLoading(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="Let’s Build Something Useful" sub="Real Estate Operations × AI Product Builder" />
        <div className="grid-12-cols mt-16">
          <div className="xl:col-span-5">
            <div className="flex-center card-border rounded-xl p-10">
              {emailConfigured ? (
                <form ref={formRef} onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
                  <div>
                    <label htmlFor="name">Your name</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="What’s your name?" required />
                  </div>
                  <div>
                    <label htmlFor="email">Your Email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="What’s your email address?" required />
                  </div>
                  <div>
                    <label htmlFor="message">Your Message</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="How can I help?" rows="5" required />
                  </div>
                  <button type="submit">
                    <div className="cta-button group">
                      <div className="bg-circle" />
                      <p className="text">{loading ? "Sending..." : "Send Message"}</p>
                      <div className="arrow-wrapper"><img src="/images/arrow-down.svg" alt="arrow" /></div>
                    </div>
                  </button>
                </form>
              ) : (
                <div className="w-full flex flex-col gap-7">
                  <p className="text-white-50 text-lg">
                    I’m interested in opportunities where real estate operations, AI, software, and automation intersect.
                  </p>
                  <a href="https://github.com/WaltLuv" target="_blank" rel="noreferrer">
                    <div className="cta-button group">
                      <div className="bg-circle" />
                      <p className="text">View My GitHub</p>
                      <div className="arrow-wrapper"><img src="/images/arrow-down.svg" alt="arrow" /></div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="xl:col-span-7 min-h-96">
            <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
              <ContactExperience />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
