// import React, { useEffect, useState } from "react";
// import { Route, useNavigate } from "react-router-dom";
// import TokenService from "./services/TokenService";
// import { useSelector } from "react-redux";
// import ErrorPopUp from "./components/ErrorPopUp";
// import loadingImage from "../src/assets/loading_gif.gif";
// import AdminHomePage from "./admin_pages/AdminHomePage";

// function PrivateRoute() {
//   const [loading, setLoading] = useState(true);
//   const [errorComponent, setErrorComponent] = useState(null);
//   const [admin, setAdmin] = useState(false);
//   const navigator = useNavigate();
//   const userToken = useSelector((state) => state.token);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await TokenService.checkRole(userToken);
//         if (response) {
//           if (response.data.role === "ADMIN") {
//             setAdmin(true);
//           } else if (response.data.role === "CUSTOMER") {
//             setAdmin(false);
//             setErrorComponent(<ErrorPopUp />);
//           }
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         setLoading(false);
//         setErrorComponent(<ErrorPopUp />);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userToken]);

//   if (loading) {
//     return (
//       <div>
//         <img src={loadingImage} alt="Loading..." />
//       </div>
//     );
//   }

//   if (errorComponent) {
//     return errorComponent;
//   }

//   if (allowed) {
//     return <Route path="/admin" element={<AdminHomePage />} />;
//   } else {
//     // If not allowed, you can redirect or show an error message here
//     return <ErrorPopUp />;
//   }
// }

// export default PrivateRoute;
