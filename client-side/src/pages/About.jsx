            <h2>User Authentication System</h2>
            import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About ShopVerse</h1>
          <p>We build a simple and trusted online shopping experience for everyone.</p>
        </div>
      </section>

      <section className="about-content container">
        <div className="about-card">
          <h3>Our Mission</h3>
          <p>
            ShopVerse helps customers discover quality products in clothing, electronics,
            bags, and footwear with clear pricing and smooth checkout flow.
          </p>
        </div>

        <div className="about-card">
          <h3>Why Choose Us</h3>
          <p>
            Fast performance, clean design, secure ordering, and responsive customer
            support make ShopVerse a dependable e-commerce platform.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Values</h3>
          <p>
            Transparency, quality, and customer-first service guide every feature and
            every product listed in our store.
          </p>
        </div>
      </section>


    </div>
  );
};

export default About;
