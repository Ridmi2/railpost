import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage       from './pages/public/HomePage';
import PublicTrack    from './pages/public/PublicTrack';
import LoginPage      from './pages/auth/LoginPage';
import SignupPage     from './pages/auth/SignupPage';

import AdminLayout    from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Stations       from './pages/admin/Stations';
import Masters        from './pages/admin/Masters';
import Trains         from './pages/admin/Trains';
import Costs          from './pages/admin/Costs';
import Reports        from './pages/admin/Reports';

import SenderLayout    from './components/layout/SenderLayout';
import SenderDashboard from './pages/sender/SenderDashboard';
import BookCargo       from './pages/sender/BookCargo';
import MyShipments     from './pages/sender/MyShipments';
import TrackCargo      from './pages/sender/TrackCargo';

import StationMasterLayout    from './components/layout/StationMasterLayout';
import StationMasterDashboard from './pages/station-master/StationMasterDashboard';
import RegisterCargo          from './pages/station-master/RegisterCargo';
import StationCargo           from './pages/station-master/StationCargo';
import ManageOfficers         from './pages/station-master/ManageOfficers';
import StationReports         from './pages/station-master/StationReports';

import OfficerLayout        from './components/layout/OfficerLayout';
import OfficerDashboard     from './pages/officer/OfficerDashboard';
import ScanCargo            from './pages/officer/ScanCargo';

import ReviewerLayout       from './components/layout/ReviewerLayout';
import ReviewerDashboard    from './pages/reviewer/ReviewerDashboard';

import ProfilePage          from './pages/shared/ProfilePage';

import PrivateRoute from './routes/PrivateRoute';
import RoleRoute    from './routes/RoleRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>

        {/* Public */}
        <Route path="/"       element={<HomePage />} />
        <Route path="/track/:trackingNumber?" element={<PublicTrack />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-5xl mb-4">⛔</p>
              <p className="text-xl font-bold text-gray-800">Access Denied</p>
              <p className="text-gray-500 mt-2">You are not authorized to view this page.</p>
            </div>
          </div>
        } />

        {/* Admin */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/stations"  element={<Stations />} />
              <Route path="/admin/masters"   element={<Masters />} />
              <Route path="/admin/trains"    element={<Trains />} />
              <Route path="/admin/costs"     element={<Costs />} />
              <Route path="/admin/reports"   element={<Reports />} />
              <Route path="/admin/profile"   element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Sender */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={['SENDER']} />}>
            <Route element={<SenderLayout />}>
              <Route path="/sender/dashboard" element={<SenderDashboard />} />
              <Route path="/sender/book"      element={<BookCargo />} />
              <Route path="/sender/shipments" element={<MyShipments />} />
              <Route path="/sender/track"     element={<TrackCargo />} />
              <Route path="/sender/profile"   element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Station Master */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={['STATION_MASTER']} />}>
            <Route element={<StationMasterLayout />}>
              <Route path="/station-master/dashboard" element={<StationMasterDashboard />} />
              <Route path="/station-master/cargo"     element={<StationCargo />} />
              <Route path="/station-master/register"  element={<RegisterCargo />} />
              <Route path="/station-master/officers"  element={<ManageOfficers />} />
              <Route path="/station-master/reports"   element={<StationReports />} />
              <Route path="/station-master/profile"   element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Station Officer */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={['STATION_OFFICER']} />}>
            <Route element={<OfficerLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/scan"      element={<ScanCargo />} />
              <Route path="/officer/profile"   element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Reviewer */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={['REVIEWER']} />}>
            <Route element={<ReviewerLayout />}>
              <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />
              <Route path="/reviewer/profile"   element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
