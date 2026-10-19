import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import LoginService from "../services/LoginService";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../redux/features/userSlice";
import AuthenticationPopUp from "../components/AuthenticationPopUp";
import ErrorPopUp from "../components/ErrorPopUp"
import TokenService from "../services/TokenService";
//import { useStompClient } from "../services/StompClientContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const navigate = useNavigate();
  const userToken = useSelector(state => state.token);
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [email, setInvalidEmail] = useState(false);
  const [pass, setInvalidPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState(false);
  const [admin, setAdmin] = useState(false);

  //const stompClient = useStompClient();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "email")
    {
      setLoginData({ ...loginData, [name]: value.toLowerCase() });
    }
    else
    {
      setLoginData({ ...loginData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { email, password } = loginData;
    
    if (!emailRegex.test(email))
    {
      alert("Please provide a proper email address.")
    }

    const body = {
      email: email.toLowerCase(),
      password: password
    };

    LoginService.Login(body)
      .then((response) => {
        if (response) {
          dispatch(setUserToken(response.data.accessToken));
          const id = response.data.id;
          localStorage.setItem('id', id);

          console.log("Login successful for user : ", body.email, " with ID: ", id);
        } else {
          console.log("Login failed. Connection not established to backend.");
        }

        ResetFields();

        const response2Promise = TokenService.checkRole(response.data.accessToken);

        response2Promise
          .then((response2) => {
            localStorage.setItem("role", response2.data.role)

            if (response2 && response2.data.role) {
              const role = response2.data.role;
              toast.success("Login successful!");
              if (role === "ADMIN") {
                navigate("/admin");
                return true;
              }
              else if (role === "CUSTOMER") {
                navigate("/products");
                return false;
              }
            }
          })


        // console.log("getting role");
        // console.log("token is " + response.data.accessToken);

        // const response2Promise = TokenService.checkRole(response.data.accessToken);

        // response2Promise
        //   .then((response2) => {
        //     console.log("role returned as...");
        //     console.log("response2 =", response2);

        //     if (response2 && response2.data && response2.data.role) {
        //       const role = response2.data.role;

        //       // Use the callback function in setAdmin to get the latest state
        //       setAdmin((prevAdmin) => {
        //         if (role === "ADMIN") {
        //           console.log("admin before: " + admin);
        //           localStorage.setItem('role', "ADMIN");
        //           console.log("role returned as... ADMIN");
        //           console.log("setting admin to TRUE");
        //           return true;
        //         } else if (role === "CUSTOMER") {
        //           localStorage.setItem('role', "CUSTOMER");
        //           console.log("role returned as... CUSTOMER");
        //           console.log("setting admin to FALSE");
        //           return false;
        //         }
        //       });
        //       console.log("admin after: " + admin)

        //       console.log("before REDIRECTING, admin = " + admin)
        //         if (admin) {
        //           console.log("admin is connected");
        //           navigate("/admin");
        //         } else {
        //           console.log("customer is connected");
        //           navigate("/products");
        //         }
        //     } else {
        //       console.error("Unable to determine role from server:", response2);
        //     }
        //   })
        //   .then(() => {
        //     // Continue with your navigation logic based on the role
        //     console.log("before REDIRECTING, admin = " + admin)

        //   });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setInvalidEmail(true);
          setInvalidPassword(false);
        }
        else if (error.response && error.response.status === 400) {
          setInvalidPassword(true);
          setInvalidEmail(false);
        }
        else {
          setConnectionError(true);
        }
        // const firstError = error.response.data.errors[0];
        // const { field, error: errorMessage } = firstError;
        // setErrorField(field);
        // setErrorMessage(errorMessage);
        console.error("Error logging in: ", error);
      });
  };


  function ResetFields() {
    setLoginData({
      email: '',
      password: ''
    });
    setInvalidEmail(false);
    setInvalidPassword(false);
    setConnectionError(false);
    setErrorField('');
    setErrorMessage('');
  }

  useEffect(() => {
    setInvalidEmail(false);
    setInvalidPassword(false);
    setConnectionError(false);
    setErrorField('');
    setErrorMessage('');
  }, [loginData.email, loginData.password])

  return (
    <form onSubmit={handleSubmit}>
      {userToken ? (
        <ErrorPopUp />
      ) : (
        <div className="main-content">
          <div className="login-title-container">
            <h1 className="display-4 auth-banner fw-bold">Authenticate</h1>
          </div>
          <div className="login-form mt-2">
            <div className="form-floating w-100 mb-4 col-lg-12">
              <input
                name="email"
                value={loginData.email}
                type="text"
                className="form-control w-100 border border-5 border-dark"
                onChange={handleChange}
                id="emailInput"
                placeholder="Email"
                required
              ></input>
              <label htmlFor="credentials">Email</label>
              {errorField || errorMessage ?
                (<div className="d-flex justify-content-center">
                  <h3 className="d-block text-center text-danger bg-light rounded mt-2">{errorField} {errorMessage}</h3>
                </div>)
                : (null)}
                {email ?
                (<div className="d-flex justify-content-center">
                  <h3 className="d-block text-center text-danger bg-light rounded mt-2">Email is not valid.</h3>
                </div>)
                : (null)}
                {pass ?
                (<div className="d-flex justify-content-center">
                  <h3 className="d-block text-center text-danger bg-light rounded mt-2">Password is not valid.</h3>
                </div>)
                : (null)}
            </div>
            <div className="form-floating w-100 mb-4">
              <input
                name="password"
                value={loginData.password}
                type="password"
                className="form-control w-100 border border-5 border-dark login_input"
                onChange={handleChange}
                id="passwordInput"
                placeholder="Password"
                required
              ></input>
              <label htmlFor="passwordInput">Password</label>
            </div>
            <button type="submit" className="btn btn-light align-self-center">
              Log in
            </button>

            <Link
              to="/register"
              color="light"
              className="text-white text-decoration-underline align-self-end"
            >
              Click here to create an account!
            </Link>
            {connectionError ? (
              <div className="d-flex justify-content-center align-items-center mt-2">
                <h3 className="text-danger bg-light p-3">
                  Error connecting to the server. Please try again.
                </h3>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {
        email ? (
          <AuthenticationPopUp problem='email' />
        ) : null
      }
      {
        pass ? (
          <AuthenticationPopUp problem='password' />
        ) : null
      }
    </form>
  );
}

export default LoginPage;