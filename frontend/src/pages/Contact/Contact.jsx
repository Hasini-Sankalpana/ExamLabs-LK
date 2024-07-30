import React from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';
import contact from '../../assets/contact.webp'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';


const Contact = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_ay6j2et', 'template_zmx1059', e.target, '-t8HSlhSWw86AATOV')
      .then((result) => {
          console.log(result.text);
          alert('Message sent successfully!');
      }, (error) => {
          console.log(error.text);
          alert('Failed to send the message, please try again.');
      });

    e.target.reset();
  };

  return (
    <div className="contact-page">
             <h2> <span>Connect</span> with our Team </h2>
             <div className="contact-para">
            <p>We'd love to hear from you! Reach out to us with any questions, feedback, or inquiries, and our team will get back to you promptly.
            </p> 
            <div className="contact-detail">
            <img src={contact} alt="" />
            <div className="contact-details">
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <div className="contact-info">
              <h3>Phone</h3>
              <p>0112500500</p>
            </div>
          </div>

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div className="contact-info">
              <h3>Email</h3>
              <p>Contact@ExamLabslk.com</p>
            </div>
          </div>

        </div>
            </div>
            

          </div>
         
      <div className="contact-container">
        <div className="contact-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={sendEmail}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" rows="5" required></textarea>
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
