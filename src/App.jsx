import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ROLES } from './utils/constants';

// Components
import ProtectedRoute from './Pages/CommonPages/ProtectedRoute';
import ProtectedLayout from './Components/CommonComponents/ProtectedLayout';
import PublicLayout from './Components/CommonComponents/PublicLayout';
import Loading from './Components/CommonComponents/Loading';

// Lazy Loaded Pages
const Home = lazy(() => import('./Pages/CommonPages/Home'));
const Contact = lazy(() => import('./Pages/CommonPages/Contact'));
const Login = lazy(() => import('./Pages/CommonPages/Login'));
const AdminLogin = lazy(() => import('./Pages/CommonPages/AdminLogin'));
const DonorLogin = lazy(() => import('./Pages/CommonPages/DonorLogin'));
const RecipientsLogin = lazy(() => import('./Pages/CommonPages/RecipientsLogin'));
// Receivers
const Receivers = lazy(() => import('./Pages/CommonPages/Receivers'));
const CaseDetails = lazy(() => import('./Pages/CommonPages/CaseDetails'));
const TermsConditions = lazy(() => import('./Pages/CommonPages/LegalTerms'));
const PrivacyPolicy = lazy(() => import('./Pages/CommonPages/LegalPrivacy'));

// Admin Pages
const AdminHome = lazy(() => import('./Pages/AdminPages/AdminHome'));
const TotalRecipients = lazy(() => import('./Pages/AdminPages/TotalRecipients'));
const RecipientDetails = lazy(() => import('./Pages/AdminPages/RecipientsDetailPage'));
const DonorList = lazy(() => import('./Pages/AdminPages/DonorList'));
const DonorDetails = lazy(() => import('./Pages/AdminPages/DonorDetails'));
const Requests = lazy(() => import('./Pages/AdminPages/Requests'));
const RequestDetails = lazy(() => import('./Pages/AdminPages/RequestDetails'));
const DonationsHistory = lazy(() => import('./Pages/AdminPages/DonationsHistory'));
const AdminNotifications = lazy(() => import('./Pages/AdminPages/AdminNotifications'));
const AchievedRequests = lazy(() => import('./Pages/AdminPages/AchievedRequests'));
const ContactMessages = lazy(() => import('./Pages/AdminPages/ContactMessages.jsx'));

// Donor Pages
const DonorHome = lazy(() => import('./Pages/DonorPages/DonorHome'));
const MyDonations = lazy(() => import('./Pages/DonorPages/MyDonations'));

// Recipient Pages
const RecipientHome = lazy(() => import('./Pages/RecipientsPages/RecipientHome'));
const ViewDetails = lazy(() => import('./Pages/RecipientsPages/ViewDetails'));
const RequestForm = lazy(() => import('./Pages/RecipientsPages/RequestForm'));

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
        <Toaster position="top-right" reverseOrder={false} />
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/receivers" element={<Receivers />} />
              <Route path="/contact" element={<Contact />} />
               <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/recipients-login" element={<RecipientsLogin />} />
              <Route path="/donor-login" element={<DonorLogin />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/case/:requestId" element={<CaseDetails />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <AdminHome />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/total-recipients"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <TotalRecipients />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recipient/:recipientId"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <RecipientDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/request/:id"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <RequestDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/total-donors"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <DonorList />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <Requests />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <DonationsHistory />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/total-donors/donor/:id"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <DonorDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <AdminNotifications />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achieved-requests"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <AchievedRequests />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <ContactMessages />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Donor Routes */}
            <Route
              path="/donor/dashboard"
              element={
                <ProtectedRoute allowedRole={ROLES.DONOR}>
                  <ProtectedLayout>
                    <DonorHome />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/mydonation"
              element={
                <ProtectedRoute allowedRole={ROLES.DONOR}>
                  <ProtectedLayout>
                    <MyDonations />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/donation/:requestId"
              element={
                <ProtectedRoute allowedRole={ROLES.DONOR}>
                  <ProtectedLayout>
                    <CaseDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Recipient Routes */}
            <Route
              path="/recipient/dashboard"
              element={
                <ProtectedRoute allowedRole={ROLES.RECIPIENT}>
                  <ProtectedLayout>
                    <RecipientHome />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/request"
              element={
                <ProtectedRoute allowedRole={ROLES.RECIPIENT}>
                  <ProtectedLayout>
                    <RequestForm />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/recipient-details/:id"
              element={
                <ProtectedRoute allowedRole={ROLES.RECIPIENT}>
                  <ProtectedLayout>
                    <ViewDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CurrencyProvider>
  );
};

export default App;
