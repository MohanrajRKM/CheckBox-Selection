import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom';
import AllFeaturesDemo from './components/AllFeaturesDemo';
import CheckboxOnlyDemo from './components/CheckboxOnlyDemo';
import HeaderCheckboxDemo from './components/HeaderCheckboxDemo';
import PersistLocalDemo from './components/PersistLocalDemo';
import PersistRemoteDemo from './components/PersistRemoteDemo';
import './App.css';


export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>All features</NavLink>
          <NavLink to="/CheckBox-Selection/checkbox-only" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Checkbox-only enabled</NavLink>
          <NavLink to="/CheckBox-Selection/header-checkbox-off" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Header checkbox disabled</NavLink>
          <NavLink to="/CheckBox-Selection/persist-local" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Persist (Local)</NavLink>
          <NavLink to="/CheckBox-Selection/persist-remote" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Persist (Remote)</NavLink>
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
