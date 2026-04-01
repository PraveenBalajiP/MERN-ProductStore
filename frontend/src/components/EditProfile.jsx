import {useEffect,useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../common_components/ConfirmDialog';
import '../css/edit-profile.css';

function EditProfile(){
    const {name}=useParams();
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(true);
    const [isSaving,setIsSaving]=useState(false);
    const [showConfirmSave,setShowConfirmSave]=useState(false);
    const [formData,setFormData]=useState({
        name:'',
        email:'',
        phone:'',
        address:''
    });

    function getErrorMessage(error,fallbackMessage){
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            fallbackMessage
        );
    }

    async function fetchProfile(){
        try{
            setIsLoading(true);
            const response=await axios.get(`/api/users/${name}/profile`,{withCredentials:true});
            setFormData({
                name:response.data?.name || '',
                email:response.data?.email || '',
                phone:response.data?.phone || '',
                address:response.data?.address || ''
            });
        }
        catch(error){
            toast.error(getErrorMessage(error,'Unable to load profile data'));
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchProfile();
    },[name]);

    function handleInputChange(event){
        const {name:fieldName,value}=event.target;
        setFormData((prev)=>({
            ...prev,
            [fieldName]:value
        }));
    }

    function isFormValid(){
        if(!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()){
            toast.error('All fields are required');
            return false;
        }

        return true;
    }

    function handleSubmit(event){
        event.preventDefault();
        if(!isFormValid()) return;
        setShowConfirmSave(true);
    }

    async function saveProfileChanges(){
        try{
            setShowConfirmSave(false);
            setIsSaving(true);
            const response=await axios.put(
                `/api/users/${name}/profile`,
                {
                    name:formData.name,
                    email:formData.email,
                    phone:formData.phone,
                    address:formData.address
                },
                {withCredentials:true}
            );

            const updatedName=response.data?.profile?.name || formData.name;
            localStorage.setItem('userName',updatedName);
            window.dispatchEvent(new Event('auth-change'));
            toast.success(response.data?.message || 'Profile updated successfully');
            navigate(`/users/${updatedName}/profile`);
        }
        catch(error){
            toast.error(getErrorMessage(error,'Unable to update profile'));
        }
        finally{
            setIsSaving(false);
        }
    }

    return(
        <div className="edit-profile-page">
            <ConfirmDialog
                open={showConfirmSave}
                title="Save Profile Changes?"
                message="Do you want to save your updated profile details?"
                confirmText="Save Changes"
                onConfirm={saveProfileChanges}
                onCancel={()=>setShowConfirmSave(false)}
            />
            <div className="edit-profile-card">
                <h1>Edit Profile</h1>
                {
                    isLoading ? (
                        <p className="edit-profile-loading">Loading profile...</p>
                    ) : (
                        <form className="edit-profile-form" onSubmit={handleSubmit}>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={4}
                                required
                            />

                            <div className="edit-profile-actions">
                                <button type="button" className="cancel-edit-profile" onClick={()=>navigate(`/users/${name}/settings`)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-edit-profile" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    );
}

export default EditProfile;