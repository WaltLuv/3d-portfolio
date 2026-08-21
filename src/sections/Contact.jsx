import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const emailConfigured = Boolean(
  import.meta.env.VITE_APP_EMAILJS_SERVICE_ID &&
  import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID &&
  import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
);

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailConfigured) return;
    setLoading(true);
    setStatus("");
    try {
      await emailjs.sendForm(import.meta.env.VITE_APP_EMAILJS_SERVICE_ID, import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID, formRef.current, import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY);
      formRef.current.reset();
      setStatus("Message sent. Thank you — I’ll follow up soon.");
    } catch {
      setStatus("The form could not send right now. Please use GitHub to connect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-world-step="10" className="world-chapter contact-chapter" aria-labelledby="contact-title">
      <div className="chapter-panel chapter-panel-right contact-narrative">
        <div className="contact-intro">
          <p className="chapter-index">CHAPTER 11 · CONTACT WORKSTATION</p>
          <h2 id="contact-title">Let&apos;s Build<br /><span>Something Useful.</span></h2>
          <p>I&apos;m interested in opportunities where AI, software, automation, and real operational problems intersect.</p>
          <div className="contact-links">
            <a href="https://github.com/WaltLuv" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
          </div>
          {!emailConfigured && <p className="contact-note">Direct email, LinkedIn, and résumé buttons will appear when their verified destinations are added.</p>}
        </div>
        <div className="contact-panel">
          {emailConfigured ? (
            <form ref={formRef} onSubmit={handleSubmit}>
              <div><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required /></div>
              <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
              <div><label htmlFor="message">What would you like to build?</label><textarea id="message" name="message" rows="5" required /></div>
              <button type="submit" disabled={loading}>{loading ? "Sending…" : "Send Message"}<span>↗</span></button>
              <p className="form-status" role="status" aria-live="polite">{status}</p>
            </form>
          ) : (
            <div className="contact-fallback">
              <span>CONTACT CHANNEL</span><strong>Configuration Ready</strong>
              <p>The secure EmailJS integration remains available and will activate automatically when the repository’s environment variables are configured.</p>
              <a href="https://github.com/WaltLuv" target="_blank" rel="noreferrer">Connect through GitHub <span>↗</span></a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
