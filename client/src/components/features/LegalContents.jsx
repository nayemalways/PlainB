import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LegalContents = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-success text-white text-center py-5 mb-5">
        <div className="container">
          <h1 className="display-4">About PlainB</h1>
          <p className="lead">
            Your trusted destination for cutting-edge electronics and innovative technology solutions.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mb-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2>Our Story</h2>
            <p>
              Founded in 2015 by passionate engineers, TechHub Electronics started as a small startup with a
              vision to make advanced technology accessible to everyone. Over the years, we have grown
              into a trusted global electronics retailer.
            </p>
            <p>
              From smartphones and laptops to smart home devices, we provide innovative products with
              exceptional quality and service.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="https://i.pinimg.com/1200x/5f/5f/d0/5f5fd0b08e19d9b1797c6b444631640a.jpg"
              alt="Our Story"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-light py-5 mb-5">
        <div className="container text-center">
          <h2 className="mb-4">Our Core Values</h2>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="card h-100 p-3">
                <div className="display-4 mb-2">⚡</div>
                <h5>Quality</h5>
                <p>We ensure reliable products from trusted brands.</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card h-100 p-3">
                <div className="display-4 mb-2">🎯</div>
                <h5>Innovation</h5>
                <p>We bring the latest tech trends to our customers.</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card h-100 p-3">
                <div className="display-4 mb-2">💝</div>
                <h5>Service</h5>
                <p>Our support team is available 24/7 for assistance.</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card h-100 p-3">
                <div className="display-4 mb-2">🌍</div>
                <h5>Sustainability</h5>
                <p>We commit to eco-friendly practices and tech solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mb-5">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <h2>Our Mission</h2>
            <p>
              To democratize access to cutting-edge technology by providing high-quality electronics,
              exceptional service, and competitive prices. We believe everyone deserves the transformative
              power of technology.
            </p>
            <ul>
              <li>Curated Selection of trusted brands</li>
              <li>Fair and Transparent Pricing</li>
              <li>Fast and Secure Delivery Worldwide</li>
            </ul>
          </div>
          <div className="col-md-6 order-md-1">
            <img
              src="https://via.placeholder.com/500x300"
              alt="Mission"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Meet Our Leadership</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100 p-3">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}>
                  JS
                </div>
                <h5>John Smith</h5>
                <p>CEO & Founder</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 p-3">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}>
                  MJ
                </div>
                <h5>Maria Johnson</h5>
                <p>CTO</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 p-3">
                <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}>
                  DL
                </div>
                <h5>David Lee</h5>
                <p>Head of Customer Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalContents;
