import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Components/CommonComponents/Header';
import Footer from './Components/CommonComponents/Footer';

import Home from './Pages/CommonPages/Home';
import About from './Pages/CommonPages/About';
import Contact from './Pages/CommonPages/Contact';
import Login from './Pages/CommonPages/Login';
import AdminLogin from './Pages/CommonPages/AdminLogin';
import DonorLogin from './Pages/CommonPages/DonorLogin';
import RecipientsLogin from './Pages/CommonPages/RecipientsLogin';
import ProtectedRoute from './Pages/CommonPages/ProtectedRoute';
import ProtectedLayout from './Components/CommonComponents/ProtectedLayout';
import AdminHome from './Pages/AdminPages/AdminHome.jsx';
import TotalRecipients from './Pages/AdminPages/TotalRecipients';
import RecipientDetails from './Pages/AdminPages/RecipientsDetailPage.jsx';
import DonorList from './Pages/AdminPages/DonorList.jsx';
import DonorDetails from './Pages/AdminPages/DonorDetails.jsx';
import DonorHome from './Pages/DonorPages/DonorHome.jsx';
import MyDonations from './Pages/DonorPages/MyDonations.jsx';

import MyDonationsDetail from './Pages/DonorPages/MyDonationsDetail.jsx';
import Requests from './Pages/AdminPages/Requests.jsx';
import RecipientHome from './Pages/RecipientsPages/RecipientHome.jsx';
import ViewDetails from './Pages/RecipientsPages/ViewDetails.jsx';
import Receivers from './Pages/CommonPages/Receivers.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import RequestDetails from './Pages/AdminPages/RequestDetails.jsx';
import axios from 'axios';
import RequestForm from './Pages/RecipientsPages/RequestForm.jsx';
  const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {






  return (
      <CurrencyProvider>
    <BrowserRouter>
     <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home/>
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />
          <Route
          path="/receivers"
          element={
            <>
              <Header />
              <Receivers />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/login/admin-login"
          element={
            <>
              <Header />
              <AdminLogin />
              <Footer />
            </>
          }
        />
        <Route
          path="/login/recipients-login"
          element={
            <>
              <Header />
              <RecipientsLogin />
              <Footer />
            </>
          }
        />
        <Route
          path="/login/donor-login"
          element={
            <>
              <Header />
              <DonorLogin />
              <Footer />
            </>
          }
        />

        {/* Protected Routes For Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'ADMIN'}>
                <AdminHome/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
               <Route
          path="/admin/total-recipients"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <TotalRecipients/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
                       <Route
          path="/admin/total-recipients"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <TotalRecipients/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        
                       <Route
          path="/admin/recipient/:recipientId"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <RecipientDetails/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

               <Route
          path="/admin/request/:id"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <RequestDetails/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
                <Route
          path="/admin/total-donors"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <DonorList/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
             <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <Requests/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
                     <Route
          path="/admin/total-donors/donor/:id"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ProtectedLayout heading={'admin'}>
                <DonorDetails/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

           {/* Protected Routes For Admin Dashboard */}
                <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <ProtectedLayout heading={'donor'}>
                <DonorHome/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


                   <Route
          path="/donor/mydonation"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <ProtectedLayout heading={'donor'}>
                <MyDonations/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

 

                        <Route
          path="/donor/donation/:recipientId"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <ProtectedLayout heading={'donor'}>
                <MyDonationsDetail/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/login/donor-login"
          element={
            <ProtectedRoute allowedRole="donor">
              <ProtectedLayout  heading={'donor'}>
                <DonorLogin />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login/recipients-login"
          element={
            <ProtectedRoute allowedRole="recipient">
              <ProtectedLayout  heading={'recipient'}>
                <RecipientsLogin />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        /> */}



         {/* Protected Routes For Admin Dashboard */}
        <Route
          path="/recipient/dashboard"
          element={
            <ProtectedRoute allowedRole="RECIPIENT">
              <ProtectedLayout heading={'recipient'}>
                <RecipientHome/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/recipient/request"
          element={
            <ProtectedRoute allowedRole="RECIPIENT">
              <ProtectedLayout heading={'recipient'}>
                <RequestForm/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/recipient/recipient-details/:id"
          element={
            <ProtectedRoute allowedRole="RECIPIENT">
              <ProtectedLayout heading={'recipient'}>
                <ViewDetails/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </CurrencyProvider>
  );
};

export default App;
