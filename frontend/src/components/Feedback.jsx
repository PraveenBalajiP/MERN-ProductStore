import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import '../css/feedback.css';

function Feedback(){
	const [feedbackData,setFeedbackData]=useState({
		type:'General',
		rating:'5',
		title:'',
		message:''
	});

	const {userName}=useParams();

	function updateFeedback(event){
		const {name,value}=event.target;
		setFeedbackData((previous)=>({...previous,[name]:value}));
	}

	async function submitFeedback(event){
		event.preventDefault();
		try{
			const response=await axios.post(`/api/users/${userName}/feedback`,feedbackData,{withCredentials:true});
			toast.success(response.data.message || 'Thank you for your feedback!');
			setFeedbackData({
				type:'General',
				rating:'5',
				title:'',
				message:''
			});
		}
		catch(error){
			toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again later.');
		}
	}

	return(
		<div className="feedback-page">
			<div className="feedback-card">
				<h1>Feedback</h1>
				<p>Share your suggestions to help improve Product Store.</p>

				<form className="feedback-form" onSubmit={submitFeedback}>
					<div className="feedback-row">
						<div className="feedback-field">
							<label htmlFor="type">Type</label>
							<select id="type" name="type" value={feedbackData.type} onChange={updateFeedback}>
								<option value="General">General</option>
								<option value="Bug">Bug</option>
								<option value="Feature Request">Feature Request</option>
								<option value="UI/UX">UI/UX</option>
							</select>
						</div>
						<div className="feedback-field">
							<label htmlFor="rating">Rating</label>
							<select id="rating" name="rating" value={feedbackData.rating} onChange={updateFeedback}>
								<option value="5">5 - Excellent</option>
								<option value="4">4 - Good</option>
								<option value="3">3 - Average</option>
								<option value="2">2 - Poor</option>
								<option value="1">1 - Very Poor</option>
							</select>
						</div>
					</div>

					<div className="feedback-field">
						<label htmlFor="title">Title</label>
						<input
							id="title"
							name="title"
							type="text"
							placeholder="Short summary"
							value={feedbackData.title}
							onChange={updateFeedback}
							required
						/>
					</div>

					<div className="feedback-field">
						<label htmlFor="message">Message</label>
						<textarea
							id="message"
							name="message"
							placeholder="Tell us what you liked or what needs improvement"
							value={feedbackData.message}
							onChange={updateFeedback}
							required
						></textarea>
					</div>

					<button type="submit" className="feedback-submit-btn">Submit Feedback</button>
				</form>
			</div>
		</div>
	);
}

export default Feedback;
