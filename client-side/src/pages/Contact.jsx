import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We are here to help with your orders and product queries.</p>
        </div>
      </section>

      <section className="contact-content container">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p><strong>Email:</strong> support@shopverse.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Address:</strong> University Road, Rajkot, Gujarat, India</p>
        </div>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea rows="5" placeholder="Write your message"></textarea>
          <button type="button">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
