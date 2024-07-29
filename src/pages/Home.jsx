import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import logo from '../images/logo.png';

const Home = () => {
  const navigate = useNavigate();

  const handleScheduleClick = () => {
    navigate('/records'); // Redirigir a la página de citas
  };

  return (
    <div className="container">
      <div className="hero-section">
        <img 
          src={logo} 
          alt="Odontología" 
          className="hero-image"
        />
        <h1 className="hero-title">Bienvenido al Centro Odontológico</h1>
        <p className="hero-subtitle">
          Tu salud dental es nuestra prioridad. Confía en nuestros expertos para una sonrisa saludable.
        </p>
        <Button 
          label="Agendar una cita" 
          icon="pi pi-calendar" 
          className="p-button-raised p-button-rounded hero-button"
          onClick={handleScheduleClick} // Manejar el clic para redirigir
        />
      </div>

      <div className="services-section">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="services-grid">
          <div className="service-card">
            <i className="pi pi-star-fill service-icon"></i>
            <h3>Odontología General</h3>
            <p>Cuidado integral para mantener tu boca saludable.</p>
          </div>
          <div className="service-card">
            <i className="pi pi-shield service-icon"></i>
            <h3>Protección Dental</h3>
            <p>Las mejores recomendaciones para el cuidado de los dientes.</p>
          </div>
          <div className="service-card">
            <i className="pi pi-heart service-icon"></i>
            <h3>Odontografías</h3>
            <p>Solicitud de Odontogramas eficiente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
