/**
 * Static content endpoints for About Us, Contact, etc.
 */

/**
 * Get about us page info - GET /api/pages/about
 */
const getAboutPage = async (req, res) => {
  return res.json({
    success: true,
    data: {
      title: "About Shopverse",
      description: "Shopverse is an e-commerce platform built to deliver quality products and reliable service for customers across Gujarat and India.",
      mission: "To make shopping convenient and accessible for every customer.",
      vision: "To become a trusted online marketplace for Indian shoppers.",
      founded: 2024,
      employees: "100+",
      countries: "5+",
    },
  });
};

/**
 * Get contact page info - GET /api/pages/contact
 */
const getContactPage = async (req, res) => {
  return res.json({
    success: true,
    data: {
      email: "support@shopverse.com",
      phone: "+1 (555) 123-4567",
      address: "Shopverse Tower, Kalavad Road, Rajkot, Gujarat 360001, India",
      hours: "Monday - Friday: 9 AM - 6 PM",
      socialMedia: {
        facebook: "https://facebook.com/shopverse",
        twitter: "https://twitter.com/shopverse",
        instagram: "https://instagram.com/shopverse",
      },
    },
  });
};

/**
 * Submit contact form - POST /api/pages/contact
 */
const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  return res.status(201).json({
    success: true,
    message: "Your message has been received. We will get back to you soon.",
    data: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  getAboutPage,
  getContactPage,
  submitContactForm,
};
