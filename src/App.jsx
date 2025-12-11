import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ROLES } from './utils/constants';

// Components
import ProtectedRoute from './Pages/CommonPages/ProtectedRoute';
import ProtectedLayout from './Components/CommonComponents/ProtectedLayout';
import PublicLayout from './Components/CommonComponents/PublicLayout';
import Loading from './Components/CommonComponents/Loading';

// Lazy Loaded Pages
const Home = lazy(() => import('./Pages/CommonPages/Home'));
const About = lazy(() => import('./Pages/CommonPages/About'));
const Contact = lazy(() => import('./Pages/CommonPages/Contact'));
const Login = lazy(() => import('./Pages/CommonPages/Login'));
const AdminLogin = lazy(() => import('./Pages/CommonPages/AdminLogin'));
const DonorLogin = lazy(() => import('./Pages/CommonPages/DonorLogin'));
const RecipientsLogin = lazy(() => import('./Pages/CommonPages/RecipientsLogin'));
const Receivers = lazy(() => import('./Pages/CommonPages/Receivers.jsx'));

// Admin Pages
const AdminHome = lazy(() => import('./Pages/AdminPages/AdminHome.jsx'));
const TotalRecipients = lazy(() => import('./Pages/AdminPages/TotalRecipients'));
const RecipientDetails = lazy(() => import('./Pages/AdminPages/RecipientsDetailPage.jsx'));
const DonorList = lazy(() => import('./Pages/AdminPages/DonorList.jsx'));
const DonorDetails = lazy(() => import('./Pages/AdminPages/DonorDetails.jsx'));
const Requests = lazy(() => import('./Pages/AdminPages/Requests.jsx'));
const RequestDetails = lazy(() => import('./Pages/AdminPages/RequestDetails.jsx'));

// Donor Pages
const DonorHome = lazy(() => import('./Pages/DonorPages/DonorHome.jsx'));
const MyDonations = lazy(() => import('./Pages/DonorPages/MyDonations.jsx'));
const MyDonationsDetail = lazy(() => import('./Pages/DonorPages/MyDonationsDetail.jsx'));

// Recipient Pages
const RecipientHome = lazy(() => import('./Pages/RecipientsPages/RecipientHome.jsx'));
const ViewDetails = lazy(() => import('./Pages/RecipientsPages/ViewDetails.jsx'));
const RequestForm = lazy(() => import('./Pages/RecipientsPages/RequestForm.jsx'));

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
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/receivers" element={<Receivers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/recipients-login" element={<RecipientsLogin />} />
              <Route path="/donor-login" element={<DonorLogin />} />
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
              path="/admin/total-donors/donor/:id"
              element={
                <ProtectedRoute allowedRole={ROLES.ADMIN}>
                  <ProtectedLayout>
                    <DonorDetails />
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
              path="/donor/donation/:recipientId"
              element={
                <ProtectedRoute allowedRole={ROLES.DONOR}>
                  <ProtectedLayout>
                    <MyDonationsDetail />
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
