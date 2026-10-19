import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/ErrorPopUp.css"

function ErrorPopUp({showForm, description }) {

    const navigator = useNavigate();

    function goBack() {
        navigator(-1)
    }

    function ani() {
        document.getElementById('new-box').classList.add('hide');
        if (showForm) {
            showForm();
          }
    }

    return (
        <div className="unauthorized-popup">
            {description ? (
                <div className="new-box" id="new-box">
                    <img src="http://100dayscss.com/codepen/alert.png"></img>
                    <h2 className="mt-4">Error!</h2>
                    <div>
                        <h5>{description}</h5>
                        <div className="button fw-bold" id="button" onClick={ani}>Dismiss</div>
                        <label htmlFor="button"></label>
                    </div>
                </div>
            ) : (
                <div className="new-box" id="new-box">
                    <img src="http://100dayscss.com/codepen/alert.png"></img>
                    <h2 className="mt-4">Error!</h2>
                    <div>
                        <h5>You cannot access this page.</h5>
                        <div className="button fw-bold" id="button" onClick={goBack}>Go back</div>
                    </div>
                </div>
            )}
        </div>
    )
}






export default ErrorPopUp;