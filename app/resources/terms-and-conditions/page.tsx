"use client";
import { useEffect, useRef, useState } from "react";

const TermsAndConditionsPage = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Create refs for each section
  const sectionRefs = Array(12)
    .fill(0)
    .map(() => useRef<HTMLDivElement>(null));

  // Content container ref for scrolling
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const scrollToSection = (index: number) => {
    setActiveSection(index);

    if (sectionRefs[index]?.current && contentRef.current) {
      // Get the container's scrollTop position
      const container = contentRef.current;
      const targetElement = sectionRefs[index].current;

      container.scrollTo({
        top: targetElement.offsetTop - container.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  // Optional: Update active section based on scroll position
  const handleScroll = () => {
    if (!contentRef.current) return;

    const container = contentRef.current;
    const scrollPosition = container.scrollTop + container.offsetTop + 50;

    // Find the current section in view
    for (let i = sectionRefs.length - 1; i >= 0; i--) {
      const currentRef = sectionRefs[i].current;
      if (currentRef && currentRef.offsetTop <= scrollPosition) {
        setActiveSection(i);
        break;
      }
    }
  };

  useEffect(() => {
    const container = contentRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dynamic gradient background with Apple Vision Pro style */}
      <div className="fixed inset-0 z-0">
        {/* Animated mesh gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.6) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 113, 92, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(162, 89, 255, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 0% 0%, rgba(255, 206, 84, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 100%, rgba(72, 187, 120, 0.4) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white/15 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '6s' }} />
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }} />
          <div className="absolute top-1/6 right-1/4 w-1 h-1 bg-white/15 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '7s' }} />
        </div>
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 flex h-full w-full items-start">
        {/* Toggle button - always visible */}
        <button
          onClick={toggleSidebar}
          className="absolute top-6 left-6 z-20 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white/80 hover:text-white shadow-lg"
          aria-label={
            sidebarVisible ? "Hide table of contents" : "Show table of contents"
          }
        >
          {sidebarVisible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Sidebar with conditional rendering */}
        {sidebarVisible && (
          <div className="flex h-screen w-80 flex-none flex-col items-start self-stretch mobile:hidden transition-all duration-300 relative">
            {/* Glassmorphism sidebar */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border-r border-white/10" />
            <div className="relative z-10 w-full h-full px-6 py-8 pt-20">
              <div className="w-full h-full">
                <h3 className="text-xl font-semibold mb-8 text-white/90">
                  Tabla de Contenido
                </h3>
                <nav className="space-y-1">
                  {[
                    "1. Identificación del responsable",
                    "2. Objeto de la plataforma", 
                    "3. Aceptación del usuario",
                    "4. Tratamiento de datos personales",
                    "5. Propiedad intelectual",
                    "6. Cuentas y seguridad",
                    "7. Limitación de responsabilidad",
                    "8. Modificaciones de los términos",
                    "9. Política de devoluciones y cambios",
                    "10. Jurisdicción y legislación aplicable",
                    "11. Contacto y canales de atención",
                    "12. Aceptación final",
                  ].map((title, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === index
                          ? "bg-white/20 text-white font-medium border border-white/30"
                          : "text-white/60 hover:text-white/90 hover:bg-white/10"
                      }`}
                    >
                      {title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content area with dynamic width */}
        <div
          className={`flex h-screen grow shrink-0 basis-0 flex-col items-start self-stretch transition-all duration-300 ${
            !sidebarVisible ? "pl-20" : ""
          }`}
        >
          {/* Header section with glassmorphism */}
          <div className="relative w-full border-b border-white/10">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm" />
            <div className="relative z-10 px-8 py-8">
              <div className="flex flex-col items-start gap-3">
                <h1 className="text-4xl font-bold text-white">
                  Términos y condiciones de uso
                </h1>
                <h2 className="text-2xl font-semibold text-white/80">
                  Hunt Tickets
                </h2>
              </div>
            </div>
          </div>
          {/* Scrollable content area */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto px-8 py-8"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Introduction section */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10" />
                <div className="relative z-10 p-8">
                  <div className="space-y-6">
                    <p className="text-sm text-white/60 font-medium">
                      Fecha de entrada en vigencia: 03 de abril de 2025
                    </p>
                    <p className="text-base text-white/80 leading-relaxed">
                      Bienvenido a Hunt Tickets S.A.S. ("HUNT", "nosotros" o "la
                      empresa"), una plataforma tecnológica que permite descubrir,
                      comprar, gestionar y transferir entradas a eventos, a través de
                      nuestra aplicación móvil, página web y canales habilitados como
                      WhatsApp. Al registrarse, acceder o utilizar nuestros servicios,
                      usted (el "Usuario") acepta plenamente estos Términos y
                      Condiciones de Uso. Le recomendamos leerlos cuidadosamente. Si
                      no está de acuerdo, le solicitamos abstenerse de usar la
                      plataforma.
                    </p>
                  </div>
                </div>
              </div>
              {/* Section 1 */}
              <div ref={sectionRefs[0]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    1. IDENTIFICACIÓN DEL RESPONSABLE
                  </h3>
                  <div className="space-y-3 text-white/80">
                    <p>Razón social: Hunt Tickets S.A.S.</p>
                    <p>NIT: 901881747</p>
                    <p>Domicilio: Calle 94 #9-44, Bogotá D.C., Colombia</p>
                    <p>Correo de contacto: info@hunt-tickets.com</p>
                    <p>WhatsApp oficial: +57 322 8597640</p>
                  </div>
                </div>
              </div>
              {/* Section 2 */}
              <div ref={sectionRefs[1]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    2. OBJETO DE LA PLATAFORMA
                  </h3>
                  <div className="space-y-4">
                    <p className="text-white font-medium">
                      HUNT es una solución tecnológica para la comercialización de
                      entradas a eventos públicos y privados. A través de nuestra
                      plataforma, los usuarios pueden:
                    </p>
                    <ul className="space-y-2 text-white/80 ml-4">
                      <li>• Comprar boletos de eventos.</li>
                      <li>• Recibir entradas en formato digital.</li>
                      <li>• Transferir entradas a otros usuarios.</li>
                      <li>• Recibir notificaciones, promociones o recordatorios personalizados.</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Section 3 */}
              <div ref={sectionRefs[2]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    3. ACEPTACIÓN DEL USUARIO
                  </h3>
                  <ul className="space-y-3 text-white/80 ml-4">
                    <li>• Declara que es mayor de edad y tiene capacidad legal para contratar.</li>
                    <li>• Acepta que la información proporcionada es veraz y actualizada.</li>
                    <li>• Se obliga a utilizar la plataforma de forma lícita y conforme a estos términos.</li>
                  </ul>
                </div>
              </div>
              {/* Section 4 */}
              <div ref={sectionRefs[3]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    4. TRATAMIENTO DE DATOS PERSONALES
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">4.1 Consentimiento informado</h4>
                      <p className="text-white/80">
                        Al registrarse en HUNT, usted autoriza de manera previa, expresa
                        e informada a Hunt Tickets S.A.S. para recolectar, almacenar,
                        usar, circular, analizar, transmitir, y eventualmente compartir
                        sus datos personales conforme a la Ley 1581 de 2012 y demás
                        normas vigentes.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">4.2 Datos recolectados</h4>
                      <ul className="space-y-2 text-white/80 ml-4">
                        <li>• Nombre completo, cédula o documento de identidad</li>
                        <li>• Número de teléfono y dirección de correo electrónico</li>
                        <li>• Fecha de nacimiento, género, ciudad de residencia</li>
                        <li>• Preferencias, eventos comprados o visualizados</li>
                        <li>• Información de dispositivos, IP, ubicación aproximada</li>
                        <li>• Métodos de pago, transacciones y comportamiento de compra</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">4.3 Finalidades del tratamiento</h4>
                      <ul className="space-y-2 text-white/80 ml-4">
                        <li>• Brindar los servicios contratados</li>
                        <li>• Mejorar la experiencia de usuario con algoritmos personalizados</li>
                        <li>• Detectar usos indebidos o fraudes</li>
                        <li>• Enviar comunicaciones sobre su cuenta, eventos o promociones</li>
                        <li>• Hacer análisis de datos agregados para toma de decisiones de negocio</li>
                        <li>• Compartir información con aliados estratégicos y proveedores tecnológicos, bajo acuerdos de confidencialidad y protección de datos.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">4.4 Uso amplio de la data</h4>
                      <div className="space-y-3 text-white/80">
                        <p>
                          HUNT se reserva el derecho a utilizar la información recolectada
                          para fines comerciales, estadísticos, de análisis, entrenamiento
                          de modelos de inteligencia artificial, predicción de
                          comportamiento de compra, publicidad personalizada y mejoras de
                          producto, siempre respetando los principios de legalidad,
                          finalidad, libertad, seguridad, veracidad y acceso.
                        </p>
                        <p>
                          En ningún caso compartiremos su información con terceros sin
                          autorización, salvo por mandato legal o contractual necesario
                          para prestar el servicio.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Section 5 */}
              <div ref={sectionRefs[4]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    5. PROPIEDAD INTELECTUAL
                  </h3>
                  <p className="text-white/80">
                    Todos los contenidos, desarrollos, algoritmos, marcas, diseños,
                    interfaces y códigos fuente usados o desarrollados por HUNT son
                    propiedad exclusiva de Hunt Tickets S.A.S. Queda prohibida su
                    copia, reproducción, modificación o comercialización sin
                    autorización previa por escrito.
                  </p>
                </div>
              </div>
              {/* Section 6 */}
              <div ref={sectionRefs[5]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    6. CUENTAS Y SEGURIDAD
                  </h3>
                  <ul className="space-y-3 text-white/80 ml-4">
                    <li>• El Usuario es responsable de mantener la confidencialidad de su cuenta y credenciales.</li>
                    <li>• En caso de uso indebido o sospecha de fraude, HUNT podrá suspender o eliminar la cuenta.</li>
                    <li>• Cualquier actividad desde su cuenta se presume hecha por usted.</li>
                  </ul>
                </div>
              </div>
              {/* Section 7 */}
              <div ref={sectionRefs[6]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    7. LIMITACIÓN DE RESPONSABILIDAD
                  </h3>
                  <ul className="space-y-3 text-white/80 ml-4">
                    <li>• Cancelaciones, modificaciones o fallas en eventos por parte de organizadores.</li>
                    <li>• Daños o perjuicios derivados del mal uso de la plataforma por parte del usuario.</li>
                    <li>• Fallas técnicas, interrupciones del servicio, pérdida de información por causas ajenas.</li>
                    <li>• El uso de la plataforma es bajo su propio riesgo.</li>
                  </ul>
                </div>
              </div>
              {/* Section 8 */}
              <div ref={sectionRefs[7]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    8. MODIFICACIONES DE LOS TÉRMINOS
                  </h3>
                  <p className="text-white/80">
                    Nos reservamos el derecho a modificar estos Términos y
                    Condiciones en cualquier momento. La versión actualizada estará
                    disponible en nuestros canales y se entiende aceptada al
                    continuar usando la plataforma.
                  </p>
                </div>
              </div>
              {/* Section 9 */}
              <div ref={sectionRefs[8]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    9. POLÍTICA DE DEVOLUCIONES Y CAMBIOS
                  </h3>
                  <p className="text-white/80">
                    Las entradas adquiridas a través de HUNT no son reembolsables,
                    salvo que el evento sea cancelado y el organizador autorice la
                    devolución. En tales casos, se aplicarán políticas específicas
                    de reembolso y tiempos de procesamiento, que serán comunicadas
                    oportunamente.
                  </p>
                </div>
              </div>
              {/* Section 10 */}
              <div ref={sectionRefs[9]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    10. JURISDICCIÓN Y LEGISLACIÓN APLICABLE
                  </h3>
                  <p className="text-white/80">
                    Este contrato se rige por las leyes de la República de Colombia.
                    Cualquier conflicto será resuelto ante la jurisdicción ordinaria
                    de la ciudad de Bogotá D.C.
                  </p>
                </div>
              </div>
              {/* Section 11 */}
              <div ref={sectionRefs[10]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    11. CONTACTO Y CANALES DE ATENCIÓN
                  </h3>
                  <div className="space-y-3 text-white/80">
                    <p>Correo electrónico: info@hunt-tickets.com</p>
                    <p>WhatsApp: +57 322 8597640</p>
                    <p>Dirección física: Calle 94 #9-44, Bogotá D.C., Colombia</p>
                  </div>
                </div>
              </div>
              {/* Section 12 */}
              <div ref={sectionRefs[11]} className="relative group">
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    12. ACEPTACIÓN FINAL
                  </h3>
                  <p className="text-white/80">
                    Al continuar con el uso de HUNT, usted manifiesta haber leído,
                    comprendido y aceptado estos Términos y Condiciones de forma
                    libre, voluntaria y expresa.
                  </p>
                </div>
              </div>

              {/* Bottom padding */}
              <div className="h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
