import React from "react";
import { Link } from "react-router-dom";
import "../components/UnauthorizedPopUp.css"

function UnauthorizedPopUp() {
    return (
        <div className="unauthorized-popup">
            <div className="new-box" id="new-box">
                <img src="http://100dayscss.com/codepen/alert.png"></img>
                <h2 className="mt-4">Unauthorized!</h2>
                <h5>You need to login/register to access this page!</h5>
                <Link to={"/"}>
                    <div className="button fw-bold" id="button">Go to login page</div>
                </Link>
                <label htmlFor="button"></label>
            </div>
        </div>
    )
}

export default UnauthorizedPopUp;