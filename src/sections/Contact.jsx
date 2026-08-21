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
      <div className="chapter-panel chapter-panel-right contact-narrative editorial-chapter-panel contact-editorial">
        <header className="chapter-heading chapter-heading-editorial">
          <p className="chapter-index">11 / CONTACT</p>
          <h2 id="contact-title">Let&apos;s build<br /><span>something useful.</span></h2>
          <p>I&apos;m interested in opportunities where AI, software, automation, and real operational problems intersect.</p>
        </header>
        <div className="contact-editorial-links">
          <a href="https://github.com/WaltLuv" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
        </div>
        {emailConfigured ? (
          <form className="contact-editorial-form" ref={formRef} onSubmit={handleSubmit}>
            <div><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required /></div>
            <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
            <div><label htmlFor="message">What would you like to build?</label><textarea id="message" name="message" rows="5" required /></div>
            <button type="submit" disabled={loading}>{loading ? "Sending…" : "Send message"}<span>↗</span></button>
            <p className="form-status" role="status" aria-live="polite">{status}</p>
          </form>
        ) : (
          <p className="contact-editorial-note">Verified public contact destinations appear only when they are available. GitHub is the current public connection point.</p>
        )}
      </div>
    </section>
  );
};

export default Contact;
