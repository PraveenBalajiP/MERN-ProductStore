import {useState} from 'react';
import {toast} from 'react-hot-toast';
import '../css/contact.css';

function Contact(){
	const [contactData,setContactData]=useState({
		name:'',
		email:'',
		subject:'',
		message:''
	});

	function updateContact(event){
		const {name,value}=event.target;
		setContactData((previous)=>({...previous,[name]:value}));
	}

	function submitContact(event){
		event.preventDefault();
		toast.success('Your message has been sent successfully.');
		setContactData({
			name:'',
			email:'',
			subject:'',
			message:''
		});
	}

	return(
		<div className="contact-page">
			<div className="contact-card">
				<h1>Contact Us</h1>
				<p>Need help with orders, bidding, or account issues? Reach out below.</p>

				<div className="contact-meta">
					<span><i className="fa-solid fa-envelope"></i> support@productstore.com</span>
					<span><i className="fa-solid fa-phone"></i> +91 90000 00000</span>
				</div>

				<form className="contact-form" onSubmit={submitContact}>
					<div className="contact-field">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							placeholder="Your name"
							value={contactData.name}
							onChange={updateContact}
							required
						/>
					</div>

					<div className="contact-field">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="Your email"
							value={contactData.email}
							onChange={updateContact}
							required
						/>
					</div>

					<div className="contact-field">
						<label htmlFor="subject">Subject</label>
						<input
							id="subject"
							name="subject"
							type="text"
							placeholder="Subject"
							value={contactData.subject}
							onChange={updateContact}
							required
						/>
					</div>

					<div className="contact-field">
						<label htmlFor="message">Message</label>
						<textarea
							id="message"
							name="message"
							placeholder="How can we help you?"
							value={contactData.message}
							onChange={updateContact}
							required
						></textarea>
					</div>

					<button type="submit" className="contact-submit-btn">Send Message</button>
				</form>
			</div>
		</div>
	);
}

export default Contact;
