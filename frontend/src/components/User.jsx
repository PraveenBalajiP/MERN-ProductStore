import { useEffect } from "react";

function User() {
    useEffect(() => {
        localStorage.setItem("nav","usernav");
        window.dispatchEvent(new Event("nav-change"));
    },[]);

    return (
        <div>
            <p>Hello</p>
        </div>
    );
}

export default User;