import '../css/settings.css';

function Settings(){
    return(
        <div className="settings-page">
            <div className="settings-card">
                <h1>Settings</h1>

                <section className="settings-section">
                    <h2>Profile Settings</h2>
                    <div className="settings-actions">
                        <button className="edit-profile-btn">Edit Profile</button>
                        <button className="change-password-btn">Change Password</button>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>Theme</h2>
                    <div className="settings-actions">
                        <button className="theme-btn">Toggle Light/Dark Mode</button>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>Account Management</h2>
                    <div className="settings-actions">
                        <button className="delete-account-btn">Delete Account</button>
                    </div>
                </section>
            </div>
        </div>

    );
}

export default Settings;