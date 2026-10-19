import React from "react";
import { Link } from "react-router-dom";
import "../components/UnauthorizedPopUp.css"

function AuthenticationPopUp({ problem }) {

    function ani(){
        document.getElementById('new-box').classList.add('hide');
        }

    return (
        <div className="authentication-popup">
            <div className="new-box" id="new-box">
                <img src="http://100dayscss.com/codepen/alert.png"></img>
                <h2 className="mt-4">Error!</h2>
                <h5>{problem === "email" ? "Email" : "Password"} is not valid!</h5>
                <Link to={"/"}>
                    <div className="button fw-bold" id="button" onClick={ani}>Dismiss</div>
                </Link>
                <label htmlFor="button"></label>
            </div>
        </div>
    )
}

export default AuthenticationPopUp;