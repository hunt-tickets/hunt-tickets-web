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
    <>
      <div className="flex h-full w-full items-start bg-default-background relative">
        {/* Toggle button - always visible */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-10 p-2 rounded-full  transition-all shadow-md"
          aria-label={
            sidebarVisible ? "Hide table of contents" : "Show table of contents"
          }
        >
          {sidebarVisible ? "◀" : "▶"}
        </button>

        {/* Sidebar with conditional rendering */}
        {sidebarVisible && (
          <div className="flex h-[calc(100vh-100px)] w-72 flex-none flex-col items-start gap-2 self-stretch bg-neutral-50 px-4 py-4 mobile:hidden transition-all duration-300">
            <div className="w-full grow shrink-0 basis-0 pt-10">
              <h3 className="font-semibold mb-4 text-gray-400">
                Tabla de Contenido
              </h3>
              <ul className="list-disc ml-5 space-y-2">
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
                  <li
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`cursor-pointer ${
                      activeSection === index
                        ? "text-primary-600 font-medium"
                        : "text-gray-300 hover:text-gray-500"
                    }`}
                  >
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main content area with dynamic width */}
        <div
          className={`flex h-[calc(100vh-100px)] grow shrink-0 basis-0 flex-col items-start self-stretch transition-all duration-300 ${
            !sidebarVisible ? "pl-12" : ""
          }`}
        >
          <div className="flex w-full items-start gap-2 border-b border-solid border-neutral-border px-6 py-6">
            <div className="flex flex-col items-start gap-2">
              <span className="text-heading-1 font-heading-1 text-default-font">
                Términos y condiciones de uso
              </span>
              <span className="text-heading-2 font-heading-2 text-default-font">
                Hunt Tickets
              </span>
            </div>
          </div>
          <div
            ref={contentRef}
            className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-10 px-4 py-4 overflow-auto md:px-[200px]"
          >
            <div className="flex flex-col items-start gap-8 pb-[200px]">
              <span className="text-body font-body text-neutral-500">
                Fecha de entrada en vigencia: 03 de abril de 2025
              </span>
              <span className="text-body font-body text-default-font">
                Bienvenido a Hunt Tickets S.A.S. ("HUNT", "nosotros" o "la
                empresa"), una plataforma tecnológica que permite descubrir,
                comprar, gestionar y transferir entradas a eventos, a través de
                nuestra aplicación móvil, página web y canales habilitados como
                WhatsApp. Al registrarse, acceder o utilizar nuestros servicios,
                usted (el "Usuario") acepta plenamente estos Términos y
                Condiciones de Uso. Le recomendamos leerlos cuidadosamente. Si
                no está de acuerdo, le solicitamos abstenerse de usar la
                plataforma.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[0]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                1. IDENTIFICACIÓN DEL RESPONSABLE
              </span>
              <span className="text-body font-body text-default-font">
                Razón social: Hunt Tickets S.A.S.
              </span>
              <span className="text-body font-body text-default-font">
                NIT: 901881747
              </span>
              <span className="text-body font-body text-default-font">
                Domicilio: Calle 94 #9-44, Bogotá D.C., Colombia
              </span>
              <span className="text-body font-body text-default-font">
                Correo de contacto: info@hunt-tickets.com
              </span>
              <span className="text-body font-body text-default-font">
                WhatsApp oficial: +57 322 8597640
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[1]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                2. OBJETO DE LA PLATAFORMA
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                HUNT es una solución tecnológica para la comercialización de
                entradas a eventos públicos y privados. A través de nuestra
                plataforma, los usuarios pueden:
              </span>
              <span className="text-body font-body text-default-font">
                Comprar boletos de eventos.
              </span>
              <span className="text-body font-body text-default-font">
                Recibir entradas en formato digital.
              </span>
              <span className="text-body font-body text-default-font">
                Transferir entradas a otros usuarios.
              </span>
              <span className="text-body font-body text-default-font">
                Recibir notificaciones, promociones o recordatorios
                personalizados.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[2]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                3. Aceptación del usuario
              </span>
              <span className="text-body font-body text-default-font">
                Declara que es mayor de edad y tiene capacidad legal para
                contratar.
              </span>
              <span className="text-body font-body text-default-font">
                Acepta que la información proporcionada es veraz y actualizada.
              </span>
              <span className="text-body font-body text-default-font">
                Se obliga a utilizar la plataforma de forma lícita y conforme a
                estos términos.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[3]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                4. Tratamiento de datos personales
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                4.1 Consentimiento informado
              </span>
              <span className="text-body font-body text-default-font">
                Al registrarse en HUNT, usted autoriza de manera previa, expresa
                e informada a Hunt Tickets S.A.S. para recolectar, almacenar,
                usar, circular, analizar, transmitir, y eventualmente compartir
                sus datos personales conforme a la Ley 1581 de 2012 y demás
                normas vigentes.
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                4.2 Datos recolectados
              </span>
              <span className="text-body font-body text-default-font">
                Nombre completo, cédula o documento de identidad
              </span>
              <span className="text-body font-body text-default-font">
                Número de teléfono y dirección de correo electrónico
              </span>
              <span className="text-body font-body text-default-font">
                Fecha de nacimiento, género, ciudad de residencia
              </span>
              <span className="text-body font-body text-default-font">
                Preferencias, eventos comprados o visualizados
              </span>
              <span className="text-body font-body text-default-font">
                Información de dispositivos, IP, ubicación aproximada
              </span>
              <span className="text-body font-body text-default-font">
                Métodos de pago, transacciones y comportamiento de compra
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                4.3 Finalidades del tratamiento
              </span>
              <span className="text-body font-body text-default-font">
                Brindar los servicios contratados
              </span>
              <span className="text-body font-body text-default-font">
                Mejorar la experiencia de usuario con algoritmos personalizados
              </span>
              <span className="text-body font-body text-default-font">
                Detectar usos indebidos o fraudes
              </span>
              <span className="text-body font-body text-default-font">
                Enviar comunicaciones sobre su cuenta, eventos o promociones
              </span>
              <span className="text-body font-body text-default-font">
                Hacer análisis de datos agregados para toma de decisiones de
                negocio
              </span>
              <span className="text-body font-body text-default-font">
                Compartir información con aliados estratégicos y proveedores
                tecnológicos, bajo acuerdos de confidencialidad y protección de
                datos.
              </span>
              <span className="text-body-bold font-body-bold text-default-font">
                4.4 Uso amplio de la data
              </span>
              <span className="text-body font-body text-default-font">
                HUNT se reserva el derecho a utilizar la información recolectada
                para fines comerciales, estadísticos, de análisis, entrenamiento
                de modelos de inteligencia artificial, predicción de
                comportamiento de compra, publicidad personalizada y mejoras de
                producto, siempre respetando los principios de legalidad,
                finalidad, libertad, seguridad, veracidad y acceso.
              </span>
              <span className="text-body font-body text-default-font">
                En ningún caso compartiremos su información con terceros sin
                autorización, salvo por mandato legal o contractual necesario
                para prestar el servicio.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[4]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                5. Propiedad intelectual
              </span>
              <span className="text-body font-body text-default-font">
                Todos los contenidos, desarrollos, algoritmos, marcas, diseños,
                interfaces y códigos fuente usados o desarrollados por HUNT son
                propiedad exclusiva de Hunt Tickets S.A.S. Queda prohibida su
                copia, reproducción, modificación o comercialización sin
                autorización previa por escrito.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[5]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                6. Cuentas y seguridad
              </span>
              <span className="text-body font-body text-default-font">
                El Usuario es responsable de mantener la confidencialidad de su
                cuenta y credenciales.
              </span>
              <span className="text-body font-body text-default-font">
                En caso de uso indebido o sospecha de fraude, HUNT podrá
                suspender o eliminar la cuenta.
              </span>
              <span className="text-body font-body text-default-font">
                Cualquier actividad desde su cuenta se presume hecha por usted.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[6]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                7. Limitación de responsabilidad
              </span>
              <span className="text-body font-body text-default-font">
                Cancelaciones, modificaciones o fallas en eventos por parte de
                organizadores.
              </span>
              <span className="text-body font-body text-default-font">
                Daños o perjuicios derivados del mal uso de la plataforma por
                parte del usuario.
              </span>
              <span className="text-body font-body text-default-font">
                Fallas técnicas, interrupciones del servicio, pérdida de
                información por causas ajenas.
              </span>
              <span className="text-body font-body text-default-font">
                El uso de la plataforma es bajo su propio riesgo.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[7]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                8. Modificaciones de los términos
              </span>
              <span className="text-body font-body text-default-font">
                Nos reservamos el derecho a modificar estos Términos y
                Condiciones en cualquier momento. La versión actualizada estará
                disponible en nuestros canales y se entiende aceptada al
                continuar usando la plataforma.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[8]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                9. Política de devoluciones y cambios
              </span>
              <span className="text-body font-body text-default-font">
                Las entradas adquiridas a través de HUNT no son reembolsables,
                salvo que el evento sea cancelado y el organizador autorice la
                devolución. En tales casos, se aplicarán políticas específicas
                de reembolso y tiempos de procesamiento, que serán comunicadas
                oportunamente.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[9]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                10. Jurisdicción y legislación aplicable
              </span>
              <span className="text-body font-body text-default-font">
                Este contrato se rige por las leyes de la República de Colombia.
                Cualquier conflicto será resuelto ante la jurisdicción ordinaria
                de la ciudad de Bogotá D.C.
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 pb-[200px]"
              ref={sectionRefs[10]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                11. Contacto y canales de atención
              </span>
              <span className="text-body font-body text-default-font">
                Correo electrónico: info@hunt-tickets.com
              </span>
              <span className="text-body font-body text-default-font">
                WhatsApp: +57 322 8597640
              </span>
              <span className="text-body font-body text-default-font">
                Dirección física: Calle 94 #9-44, Bogotá D.C., Colombia
              </span>
            </div>
            <div
              className="flex flex-col items-start gap-2 py-[200px]"
              ref={sectionRefs[11]}
            >
              <span className="text-heading-2 font-heading-2 text-subtext-color">
                12. Aceptación final
              </span>
              <span className="text-body font-body text-default-font">
                Al continuar con el uso de HUNT, usted manifiesta haber leído,
                comprendido y aceptado estos Términos y Condiciones de forma
                libre, voluntaria y expresa.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditionsPage;
