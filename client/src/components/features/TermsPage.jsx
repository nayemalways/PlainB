import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TermsPage = () => {
  return (
    <div className="container my-5">
      {/* Page Header */}
      <header className="mb-5 text-center">
        <h1 className="display-4">Terms & Conditions</h1>
        <p className="lead">Please read these terms carefully before using PlainB.</p>
      </header>

      {/* Introduction */}
      <section className="mb-4">
        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>PlainB</strong>, your trusted electronics e-commerce platform. By using our
          website and services, you agree to comply with and be bound by these Terms & Conditions. If you
          do not agree with any part of these terms, please refrain from using our services.
        </p>
      </section>

      {/* Use of Website */}
      <section className="mb-4">
        <h2>2. Use of Website</h2>
        <ul>
          <li>You must be at least 18 years old to purchase products from PlainB.</li>
          <li>All content provided on the website is for informational purposes only and may be updated without notice.</li>
          <li>You agree not to misuse the website or interfere with its normal operation.</li>
        </ul>
      </section>

      {/* Orders and Payments */}
      <section className="mb-4">
        <h2>3. Orders & Payments</h2>
        <ul>
          <li>All orders are subject to product availability and acceptance.</li>
          <li>Prices and promotions are subject to change without prior notice.</li>
          <li>We accept secure online payments and all transactions must be completed before shipment.</li>
        </ul>
      </section>

      {/* Shipping & Delivery */}
      <section className="mb-4">
        <h2>4. Shipping & Delivery</h2>
        <ul>
          <li>PlainB strives to deliver products within the estimated timeframes, but delays may occur.</li>
          <li>Customers are responsible for providing accurate shipping information.</li>
          <li>Shipping fees may vary based on location and selected delivery method.</li>
        </ul>
      </section>

      {/* Returns & Refunds */}
      <section className="mb-4">
        <h2>5. Returns & Refunds</h2>
        <ul>
          <li>Products can be returned within 14 days of delivery, subject to our return policy.</li>
          <li>Refunds will be processed after verification of the returned items.</li>
          <li>Certain products (like opened software or perishable items) may not be eligible for return.</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-4">
        <h2>6. Intellectual Property</h2>
        <p>
          All content on PlainB, including images, text, logos, and product descriptions, is the property
          of PlainB or its partners. Unauthorized use is strictly prohibited.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-4">
        <h2>7. Limitation of Liability</h2>
        <p>
          PlainB will not be liable for any direct, indirect, incidental, or consequential damages
          arising from the use of our website or products. Use our services at your own risk.
        </p>
      </section>

      {/* Privacy */}
      <section className="mb-4">
        <h2>8. Privacy</h2>
        <p>
          Your personal information is handled in accordance with our <a href="/privacy">Privacy Policy</a>.
          By using PlainB, you consent to the collection and use of your data as outlined in our policy.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-4">
        <h2>9. Changes to Terms</h2>
        <p>
          PlainB reserves the right to update or modify these Terms & Conditions at any time. Updated terms
          will be posted on this page and are effective immediately upon publication.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-4">
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions regarding these Terms & Conditions, please contact us at
          <strong> support@plainb.com</strong>.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} PlainB. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsPage;
