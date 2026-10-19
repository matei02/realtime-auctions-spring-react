import React, { useEffect, useRef, useState } from "react";
import "./NavBar.css"
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/userSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NavBar() {
    const userToken = useSelector((state) => state.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const [isNavOpen, setNavOpen] = useState(false);
    // const navbarRef = useRef();

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (navbarRef.current && !navbarRef.current.contains(event.target)) {
    //             setNavOpen(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

    // const handleToggle = () => {
    //     setNavOpen(!isNavOpen);
    // };

    function Logout() {
        toast.info("You have logged out.")

        // navigate("/home");
        dispatch(logout());
        localStorage.removeItem("role")
        localStorage.clear();
        localStorage.removeItem("id")
    }

    return (
        <nav className="custom-navbar navbar navbar-expand-lg">
            <div className="leftside-navbar">
                {
                    localStorage.getItem("role") == "ADMIN" ? (
                        <>
                            <NavLink className="link" to="/admin">
                                Overview
                            </NavLink>
                            <NavLink className="link" to="/home">
                                ColorSickness
                            </NavLink>
                            <NavLink className="link" to="/admin/top-spenders">
                                Top Spenders
                            </NavLink>
                        </>

                    ) : (
                        <>
                            <NavLink className="link" to="/home">
                                ColorSickness
                            </NavLink>
                        </>)

                }
            </div>
            <button
                className="navbar-toggler hamburger-button border border-light"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo01"
                aria-controls="navbarTogglerDemo01"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="btn btn-light navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                <div className="leftside-navbar">
                    <NavLink className="link" to="/products">
                        Catalogue
                    </NavLink>
                </div>
                <div className="authentication">
                    {userToken ? (
                        <div className="rightside-navbar">
                            <NavLink className="link" to="/profile">
                                {
                                    localStorage.getItem("role") == "ADMIN" ? (
                                        <p className="mb-0">ADMIN</p>
                                    ) : (
                                        <p className="mb-0">Profile</p>
                                    )
                                }

                            </NavLink>
                            <NavLink className="link" to="/support">Support</NavLink>
                            <NavLink className="link" to="/" onClick={Logout}>
                                Logout
                            </NavLink>
                        </div>
                    ) : (
                        <div className="rightside-navbar">
                            <NavLink className="link" to="/">
                                Login
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>

        // <nav className="custom-navbar navbar navbar-expand-lg">
        //     <div className="leftside-navbar">
        //         <NavLink className="link" to="/home">
        //             ColorSickness
        //         </NavLink>
        //     </div>
        //     <button
        //         onClick={handleToggle}
        //         className="navbar-toggler hamburger-button border border-light"
        //         type="button"
        //         aria-label="Toggle navigation"
        //     >
        //         <span className="btn btn-light navbar-toggler-icon"></span>
        //     </button>
        //     <div className={`collapse navbar-collapse${isNavOpen ? " show" : ""}`} id="navbarTogglerDemo01" ref={navbarRef}>
        //         <div className="leftside-navbar">
        //             <NavLink className="link" to="/products">
        //                 Catalogue
        //             </NavLink>
        //         </div>
        //         <div className="authentication">
        //             {userToken ? (
        //                 <div className="rightside-navbar">
        //                     <NavLink className="link" to="/profile">
        //                         Profile
        //                     </NavLink>
        //                     <NavLink className="link" onClick={Logout}>
        //                         Logout
        //                     </NavLink>
        //                 </div>
        //             ) : (
        //                 <div className="rightside-navbar">
        //                     <NavLink className="link" to="/">
        //                         Login
        //                     </NavLink>
        //                 </div>
        //             )}
        //         </div>
        //     </div>
        // </nav>
    )
}

export default NavBar;