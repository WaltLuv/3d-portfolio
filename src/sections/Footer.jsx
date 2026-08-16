const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <p>Real Estate Operations × AI Product Builder</p>
        </div>
        <div className="socials"><a className="footer-link" href="https://github.com/WaltLuv" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Walter Thornton. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
