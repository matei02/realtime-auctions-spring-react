import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import CataloguePage from './pages/CataloguePage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from "./pages/ProfilePage"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DetailPage from './pages/DetailPage'
import { useDispatch } from "react-redux";
import { logout } from './redux/features/userSlice'
// import PrivateRoute from './PrivateRoute'
import AdminHomePage from './admin_pages/AdminHomePage'
import EditAdminPage from './admin_pages/EditAdminPage'
import EditCustomerPage from './admin_pages/EditCustomerPage'
import AddAdminPage from './admin_pages/AddAdminPage'
import AddCustomerPage from './admin_pages/AddCustomerPage'
import AddPaintingPage from './admin_pages/AddPaintingPage'
import OrderHistoryPage from './admin_pages/OrderHistoryPage'
import EditPaintingPage from './admin_pages/EditPaintingPage'
// import { StompClientProvider } from './services/StompClientContext'
import AuctionPage from './pages/AuctionPage'
import SupportChat from './pages/SupportChat'
import OrderPage from './pages/OrderPage'
import { ToastContainer } from 'react-toastify'
import TopSpendersDashboard from './admin_pages/TopSpendersDashboard'

function App() {


  // const dispatch = useDispatch();

  // ///DISCONNECT USER AFTER CLOSING APP
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Perform cleanup actions before the user leaves the page
  //     dispatch(logout());
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [dispatch]);

  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/products' element={<CataloguePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/detail/:id' element={<DetailPage />} />
          <Route path='/auction' element={<AuctionPage />} />
          <Route path='/support' element={<SupportChat />} />
          <Route path='/order/:id' element={<OrderPage />} />


          {/* ADMIN PAGES */}
          <Route path='/admin' element={<AdminHomePage />} />
          <Route path='/admin/edit-admin/:id' element={<EditAdminPage />} />
          <Route path='/admin/edit-customer/:id' element={<EditCustomerPage />} />
          <Route path='/admin/add-admin' element={<AddAdminPage />} />
          <Route path='/admin/add-customer' element={<AddCustomerPage />} />
          <Route path='/admin/add-painting' element={<AddPaintingPage />} />
          <Route path='/admin/edit-painting/:id' element={<EditPaintingPage />} />
          <Route path='/admin/orderhistory' element={<OrderHistoryPage />} />
          <Route path='/admin/top-spenders' element={<TopSpendersDashboard />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div >
  )
}

export default App
