import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom';
import AllFeaturesDemo from './components/AllFeaturesDemo';
import CheckboxOnlyDemo from './components/CheckboxOnlyDemo';
import HeaderCheckboxDemo from './components/HeaderCheckboxDemo';
import PersistLocalDemo from './components/PersistLocalDemo';
import PersistRemoteDemo from './components/PersistRemoteDemo';
import './App.css';

// Explicitly type NavLink className callback to satisfy TS noImplicitAny
const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link active' : 'nav-link');

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <NavLink to="/" className={linkClass}>All features</NavLink>
          <NavLink to="/CheckBox-Selection/checkbox-only" className={linkClass}>Checkbox-only enabled</NavLink>
          <NavLink to="/CheckBox-Selection/header-checkbox-off" className={linkClass}>Header checkbox disabled</NavLink>
          <NavLink to="/CheckBox-Selection/persist-local" className={linkClass}>Persist (Local)</NavLink>
          <NavLink to="/CheckBox-Selection/persist-remote" className={linkClass}>Persist (Remote)</NavLink>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<AllFeaturesDemo />}
          />
          <Route
            path="/CheckBox-Selection/checkbox-only"
            element={<CheckboxOnlyDemo />}
          />
          <Route
            path="/CheckBox-Selection/header-checkbox-off"
            element={<HeaderCheckboxDemo />}
          />
          <Route
            path="/CheckBox-Selection/persist-local"
            element={<PersistLocalDemo />}
          />
          <Route
            path="/CheckBox-Selection/persist-remote"
            element={<PersistRemoteDemo />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
