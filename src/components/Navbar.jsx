import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      if (role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const items = [
    { label: 'Inicio', icon: 'pi pi-fw pi-home', url: '/' },
    isAdmin && { label: 'Pacientes', icon: 'pi pi-fw pi-users', url: '/patients' },
    { label: 'Citas', icon: 'pi pi-fw pi-file', url: '/records' },
    { label: 'Odontogramas', icon: 'pi pi-fw pi-pencil', url: '/odontograms' },
    { label: 'Facturas', icon: 'pi pi-fw pi-dollar', url: '/factures' },
  ].filter(Boolean);

  const start = <h2 style={{ margin: '0' }}>Centro Odontológico</h2>;
  const end = isAuthenticated ? (
    <button className="btn btn-danger" onClick={handleLogout}>Desconectar</button>
  ) : (
    <button className="btn btn-primary" onClick={() => navigate('/login')}>Iniciar Sesión</button>
  );

  return (
    <div>
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default Navbar;
