import React, { useEffect, useState } from "react";
import ErrorPopUp from "../components/ErrorPopUp";
import "../admin_pages/AdminHomePage.css";
import CustomerSerivce from "../services/CustomerService";
import { useSelector } from "react-redux/es/hooks/useSelector";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import AdminService from "../services/AdminService";
import { Link } from "react-router-dom";
import AddAdminPage from "./AddAdminPage";
import AddCustomerPage from "./AddCustomerPage";
import AddPaintingPage from "./AddPaintingPage";
import OrderHistoryPage from "./OrderHistoryPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

function AdminHomePage() {
  const role = localStorage.getItem("role");
  const userToken = useSelector((state) => state.token);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  function getCustomers() {
    CustomerSerivce.getAllCustomers(userToken)
      .then((response) => {
        if (response) {
          setCustomers(response.data.customers);
        } else {
          console.log("error retrieving customers: " + response.error);
        }
      });
  }

  function getAdmins() {
    AdminService.getAllAdmins(userToken)
      .then((response) => {
        if (response) {
          setAdmins(response.data.allAdmins);
        } else {
          console.log("error retrieving admins: " + response.error);
        }
      });
  }

  useEffect(() => {
    getCustomers();
    getAdmins();
  }, []); 

  // Filter customers based on search input
  const filteredCustomersList = customers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Filter admins based on search input
  const filteredAdminsList = admins.filter((admin) =>
    admin.name.toLowerCase().includes(adminSearch.toLowerCase())
  );

  useEffect(() => {
    setFilteredCustomers(filteredCustomersList);
  }, [customerSearch, customers]);

  useEffect(() => {
    setFilteredAdmins(filteredAdminsList);
  }, [adminSearch, admins]);

  ///// PAGINATION BELOW
  //const [displayedCustomers, setDisplayedCustomers] = useState([]);
  // const [displayedAdmins, setDisplayedAdmins] = useState([]);
  // const itemsPerPage = 2;
  // const [customerPage, setCustomerPage] = useState(1);
  // const [adminPage, setAdminPage] = useState(1);
  // ---------------------------------------------------------
  // useEffect(() => {
  //   const startCustomerIndex = (customerPage - 1) * itemsPerPage;
  //   const endCustomerIndex = startCustomerIndex + itemsPerPage;
  //   setDisplayedCustomers(filteredCustomersList.slice(startCustomerIndex, endCustomerIndex));
  // }, [customerPage, filteredCustomersList, itemsPerPage]);

  // useEffect(() => {
  //   const startAdminIndex = (adminPage - 1) * itemsPerPage;
  //   const endAdminIndex = startAdminIndex + itemsPerPage;
  //   setDisplayedAdmins(filteredAdminsList.slice(startAdminIndex, endAdminIndex));
  // }, [adminPage, filteredAdminsList, itemsPerPage]);

  // const showLoadMoreCustomers = filteredCustomersList.length > displayedCustomers.length;
  // const showLoadMoreAdmins = filteredAdminsList.length > displayedAdmins.length;

  // const handleLoadMoreCustomers = () => {
  //   setCustomerPage(customerPage + 1);
  // };

  // const handleLoadMoreAdmins = () => {
  //   setAdminPage(adminPage + 1);
  // };

  function scrollToCustomers() {
    const scrollToTarget = () => {
      const targetElement = document.getElementById("customerSearchInput");

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToTarget();
  }

  function scrollToAdmins() {
    const scrollToTarget = () => {
      const targetElement = document.getElementById("adminSearchInput");

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToTarget();
  }

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {userToken ? (
        <div className="admin_main_content" id="topDiv">
          {role === "ADMIN" ? (
            <>
              <button onClick={scrollToTop} className="go_to_top_button">
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
              <div className="col-12 d-flex justify-content-between bg-light mb-5 p-3 flex-wrap bg-warning-subtle">
                <Link to="/admin/add-admin" className="h4 fw-bold mt-auto mb-auto text-decoration-underline p-2">
                  Add Admin
                </Link>
                <Link to="/admin/add-customer" className="h4 fw-bold mt-auto mb-auto text-decoration-underline p-2">
                  Add Customer
                </Link>
                <Link to="/admin/add-painting" className="h4 fw-bold mt-auto mb-auto text-decoration-underline p-2">
                  Add Painting
                </Link>
                <Link to="/admin/orderhistory" className="h4 fw-bold mt-auto mb-auto text-decoration-underline p-2">
                  View Orders
                </Link>
              </div>
              <div className="row">

                <div className="col-12 col-sm-6 col-md-6">
                  <input
                    id="customerSearchInput"
                    type="text"
                    className="bg-warning-subtle form-control-lg w-100 mb-4 text-black border border-5 border-black"
                    placeholder="Search Customers by Name"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                  <div className="col-12 d-flex justify-content-around mb-3">
                    <button className="btn btn-warning border border-5 border-black btn-lg" onClick={scrollToAdmins}>Go to Admins</button>
                  </div>
                  <h2 className="fw-bold text-bg-light text-center">Customers:</h2>
                  {/* displayedCustomers */}
                  {filteredCustomers.map((customer) => (
                    <Link to={`edit-customer/${customer.id}`} key={customer.id} className="card_account ">
                      <div className="border border-3 mb-3 bg-secondary text-center text-light card_account ">
                        <p className="fw-bold h4 mt-3 text-danger text-bg-dark">ID: {customer.id}</p>
                        <p className="fw-bold h4 text-l">Name: {customer.name}</p>
                        <p className="fw-bold h4">Age: {customer.age}</p>
                        <p className="fw-bold h4 mb-3">Email: {customer.email}</p>
                      </div>
                    </Link>
                  ))}
                  {/* {showLoadMoreCustomers && (
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-warning" onClick={handleLoadMoreCustomers}>
                        Load More Customers
                      </button>
                    </div>
                  )} */}
                </div>
                <div className="col-12 col-sm-6 col-md-6">
                  <input
                    id="adminSearchInput"
                    type="text"
                    className="bg-warning-subtle form-control-lg w-100 mb-4 text-black border border-5 border-black"
                    placeholder="Search Admins by Name"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                  <div className="col-12 d-flex justify-content-around mb-3">
                    <button className="btn btn-warning border border-5 border-black btn-lg" onClick={scrollToCustomers}>Go to Customers</button>
                  </div>
                  <h2 className="fw-bold text-bg-light text-center">Admins:</h2>
                  {/* displayedAdmins */}
                  {filteredAdmins.map((admin) => (
                    <Link to={`edit-admin/${admin.id}`} key={admin.id}>
                      <div className="border border-3 mb-3 bg-secondary text-center text-light">
                        <p className="fw-bold h4 mt-3 text-danger text-bg-dark">ID: {admin.id}</p>
                        <p className="fw-bold h4">Name: {admin.name}</p>
                        <p className="fw-bold h4 mb-3">Email: {admin.email}</p>
                      </div>
                    </Link>
                  ))}
                  {/* {showLoadMoreAdmins && (
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-warning" onClick={handleLoadMoreAdmins}>
                        Load More Admins
                      </button>
                    </div>
                  )} */}
                </div>
              </div>
            </>
          ) : (
            <ErrorPopUp />
          )}
        </div>
      ) : (
        <UnauthorizedPopUp></UnauthorizedPopUp>
      )}
    </>
  );
}

export default AdminHomePage;
