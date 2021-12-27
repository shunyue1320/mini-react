import React from "react";
import { useNavigate } from "../react-router-dom";

function Home() {
    let navigate = useNavigate();
    function navigateTo() {
        navigate('/profile');
    }
    return (
        <div>
            <p>Home</p>
            <button onClick={navigateTo}>跳转到/profile</button>
        </div>
    )
}
export default Home;