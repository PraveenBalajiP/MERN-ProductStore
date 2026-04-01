import { useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../common_components/ConfirmDialog';
import '../css/settings.css';

function Settings(){
    const navigate=useNavigate();
    const {name}=useParams();
    const [theme,setTheme]=useState(localStorage.getItem('theme') || 'light');
    const [confirmDeleteOpen,setConfirmDeleteOpen]=useState(false);

    function editProfile(){
        navigate(`/users/${name}/edit-profile`);
    }

    function changePassword(){
        navigate(`/users/${name}/edit-password`);
    }

    function toggleTheme(){
        const nextTheme=theme==='light'?'dark':'light';
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme',nextTheme);
        localStorage.setItem('theme',nextTheme);
        toast.success(`Switched to ${nextTheme} mode`);
    }

    async function deleteAccount(){
        try{
            const responseDelete=await axios.delete(`/api/users/${name}/deleteAccount`,{withCredentials:true});
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            window.dispatchEvent(new Event('auth-change'));
            toast.success(responseDelete.data?.message || 'Account deleted successfully');
            navigate('/signup');
        }
        catch(error){
            toast.error(error.response?.data?.message || 'Failed to delete account. Please try again later.');
        }
    }

    return(
        <div className="settings-page">
            <ConfirmDialog
                open={confirmDeleteOpen}
                title="Delete Account?"
                message="This action is permanent and cannot be undone. Do you want to continue?"
                confirmText="Delete Account"
                danger={true}
                onConfirm={deleteAccount}
                onCancel={()=>setConfirmDeleteOpen(false)}
            />
            <div className="settings-card">
                <h1>Settings</h1>

                <section className="settings-section">
                    <h2>Profile Settings</h2>
                    <div className="settings-actions">
                        <button className="edit-profile-btn"
                                onClick={editProfile}>Edit Profile</button>
                        <button className="change-password-btn"
                                onClick={changePassword}>Change Password</button>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>Theme</h2>
                    <div className="settings-theme-toggle-row">
                        <span>{theme==='dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        <label className="settings-switch" htmlFor="theme-switch">
                            <input
                                id="theme-switch"
                                type="checkbox"
                                checked={theme==='dark'}
                                onChange={toggleTheme}
                            />
                            <span className="settings-slider" />
                        </label>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>Account Management</h2>
                    <div className="settings-actions">
                        <button className="delete-account-btn" onClick={()=>setConfirmDeleteOpen(true)}>Delete Account</button>
                    </div>
                </section>
            </div>
        </div>

    );
}

export default Settings;