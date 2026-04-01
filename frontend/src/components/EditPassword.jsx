import { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../common_components/ConfirmDialog';
import '../css/edit-password.css';

function EditPassword(){
	const navigate=useNavigate();
	const {name}=useParams();
	const [isSaving,setIsSaving]=useState(false);
	const [showConfirmSave,setShowConfirmSave]=useState(false);
	const [passwordData,setPasswordData]=useState({
		currentPassword:'',
		newPassword:'',
		confirmPassword:''
	});

	function getErrorMessage(error,fallbackMessage){
		return (
			error?.response?.data?.message ||
			error?.response?.data?.error ||
			error?.message ||
			fallbackMessage
		);
	}

	function handleInputChange(event){
		const {name:fieldName,value}=event.target;
		setPasswordData((prev)=>({
			...prev,
			[fieldName]:value
		}));
	}

	function isFormValid(){
		if(!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword){
			toast.error('All password fields are required');
			return false;
		}

		if(passwordData.newPassword.length<6){
			toast.error('New password must be at least 6 characters long');
			return false;
		}

		if(passwordData.newPassword!==passwordData.confirmPassword){
			toast.error('New password and confirm password do not match');
			return false;
		}

		return true;
	}

	function handleSubmit(event){
		event.preventDefault();
		if(!isFormValid()) return;
		setShowConfirmSave(true);
 	}

	async function savePasswordChanges(){
		try{
			setShowConfirmSave(false);
			setIsSaving(true);
			const response=await axios.put(
				`/api/users/${name}/password`,
				passwordData,
				{withCredentials:true}
			);

			toast.success(response.data?.message || 'Password updated successfully');
			setPasswordData({
				currentPassword:'',
				newPassword:'',
				confirmPassword:''
			});
			navigate(`/users/${name}/settings`);
		}
		catch(error){
			toast.error(getErrorMessage(error,'Unable to update password'));
		}
		finally{
			setIsSaving(false);
		}
	}

	return(
		<div className="edit-password-page">
			<ConfirmDialog
				open={showConfirmSave}
				title="Save Password Changes?"
				message="Do you want to update your password now?"
				confirmText="Update Password"
				onConfirm={savePasswordChanges}
				onCancel={()=>setShowConfirmSave(false)}
			/>
			<div className="edit-password-card">
				<h1>Change Password</h1>
				<form className="edit-password-form" onSubmit={handleSubmit}>
					<label htmlFor="currentPassword">Current Password</label>
					<input
						id="currentPassword"
						name="currentPassword"
						type="password"
						value={passwordData.currentPassword}
						onChange={handleInputChange}
						required
					/>

					<label htmlFor="newPassword">New Password</label>
					<input
						id="newPassword"
						name="newPassword"
						type="password"
						value={passwordData.newPassword}
						onChange={handleInputChange}
						required
					/>

					<label htmlFor="confirmPassword">Confirm New Password</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						value={passwordData.confirmPassword}
						onChange={handleInputChange}
						required
					/>

					<div className="edit-password-actions">
						<button type="button" className="cancel-edit-password" onClick={()=>navigate(`/users/${name}/settings`)}>
							Cancel
						</button>
						<button type="submit" className="save-edit-password" disabled={isSaving}>
							{isSaving ? 'Updating...' : 'Update Password'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditPassword;