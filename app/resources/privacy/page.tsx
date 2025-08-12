const PrivacyPage = () => {
  return (
    <div className="flex w-full flex-col items-center px-4 py-10 text-justify text-base leading-relaxed text-gray-800">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-400">
          POLÍTICA DE PRIVACIDAD – HUNT TICKETS S.A.S.
        </h1>
        <p className="text-sm text-center text-gray-300">
          Fecha de entrada en vigencia: [Actualizar fecha oficial]
        </p>

        <p className="text-gray-300">
          Hunt Tickets S.A.S., en adelante “HUNT”, reconoce la importancia de
          proteger la privacidad de los datos personales de sus usuarios, y se
          compromete con el tratamiento adecuado, responsable y seguro de la
          información recolectada a través de sus plataformas tecnológicas,
          conforme a la legislación colombiana vigente.
        </p>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            1. IDENTIFICACIÓN DEL RESPONSABLE
          </h2>
          <ul className="list-disc ml-5 mt-2 text-gray-300">
            <li>Razón social: Hunt Tickets S.A.S.</li>
            <li>NIT: 901881747</li>
            <li>Domicilio: Calle 94 #9-44, Bogotá D.C., Colombia</li>
            <li>Correo electrónico: info@hunt-tickets.com</li>
            <li>
              WhatsApp oficial:{" "}
              <a
                href="https://api.whatsapp.com/send/?phone=+573228597640"
                className="text-green-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +57 322 8597640
              </a>
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            2. DEFINICIONES RELEVANTES
          </h2>
          <ul className="list-disc ml-5 mt-2 text-gray-300">
            <li>
              <strong>Dato personal:</strong> Información que permite
              identificar a una persona.
            </li>
            <li>
              <strong>Titular:</strong> Persona natural dueña de los datos
              personales.
            </li>
            <li>
              <strong>Tratamiento:</strong> Recolección, almacenamiento, uso,
              circulación o supresión.
            </li>
            <li>
              <strong>Encargado:</strong> Persona o entidad que trata datos por
              cuenta del responsable.
            </li>
            <li>
              <strong>Autorización:</strong> Consentimiento previo, expreso e
              informado del titular.
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            3. DATOS QUE RECOLECTAMOS
          </h2>
          <ul className="list-disc ml-5 mt-2 text-gray-300">
            <li>
              Identificación: nombre, documento, fecha de nacimiento, género.
            </li>
            <li>Contacto: correo electrónico, celular, ciudad.</li>
            <li>Comportamiento: eventos visualizados, favoritos, compras.</li>
            <li>Técnicos: IP, dispositivo, navegador, sistema operativo.</li>
            <li>
              Transaccionales: medios de pago, frecuencia, valor de compra.
            </li>
            <li>Sensibles: ubicación, intereses culturales o musicales.</li>
          </ul>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            4. FINALIDADES DEL TRATAMIENTO
          </h2>

          <h3 className="font-semibold mt-2 text-gray-400">
            4.1 Finalidades operativas
          </h3>
          <ul className="list-disc ml-5 text-gray-300">
            <li>Crear y gestionar su cuenta.</li>
            <li>Procesar compras de entradas.</li>
            <li>Enviar boletos y recordatorios.</li>
            <li>Acceso y registro a eventos.</li>
          </ul>

          <h3 className="font-semibold mt-4 text-gray-400">
            4.2 Finalidades analíticas y comerciales
          </h3>
          <ul className="list-disc ml-5 text-gray-300">
            <li>Analizar comportamiento y consumo.</li>
            <li>Personalizar recomendaciones.</li>
            <li>Mejorar algoritmos y experiencia.</li>
            <li>Estudios de mercado internos.</li>
          </ul>

          <h3 className="font-semibold mt-4 text-gray-400">
            4.3 Publicidad y monetización
          </h3>
          <ul className="list-disc ml-5 text-gray-300">
            <li>Promociones personalizadas.</li>
            <li>Beneficios o cupones según perfil.</li>
            <li>
              Compartir información con aliados estratégicos bajo
              confidencialidad para marketing y desarrollo.
            </li>
          </ul>

          <p className="mt-2 text-sm italic text-gray-300">
            Nota: Nunca venderemos datos personales sin autorización expresa.
          </p>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            5. TRATAMIENTO DE DATOS SENSIBLES Y DE MENORES
          </h2>
          <ul className="list-disc ml-5 mt-2 text-gray-300">
            <li>No es obligatorio suministrar datos sensibles.</li>
            <li>
              Se presume que los menores tienen consentimiento de su
              representante legal.
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            6. DERECHOS DEL TITULAR
          </h2>
          <p className="mt-2 text-gray-300">
            Conforme a la Ley 1581 de 2012, el titular puede:
          </p>
          <ul className="list-disc ml-5 text-gray-300">
            <li>Conocer, actualizar y rectificar sus datos.</li>
            <li>Solicitar prueba de la autorización.</li>
            <li>Ser informado sobre el uso de sus datos.</li>
            <li>Revocar autorización o solicitar supresión.</li>
            <li>Acceder gratuitamente a su información.</li>
          </ul>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            7. MEDIDAS DE SEGURIDAD
          </h2>
          <p className="text-gray-300">
            HUNT implementa medidas técnicas, humanas y administrativas para
            proteger la información contra pérdidas, accesos no autorizados, o
            usos indebidos.
          </p>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            8. TRANSFERENCIA INTERNACIONAL DE DATOS
          </h2>
          <p className="text-gray-300">
            Si se transfieren datos a otros países, se garantizará un nivel de
            protección equivalente al colombiano.
          </p>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            9. TIEMPO DE CONSERVACIÓN DE DATOS
          </h2>
          <p className="text-gray-300">
            Los datos serán conservados el tiempo necesario para cumplir las
            finalidades, luego se eliminarán o anonimizarán según la ley.
          </p>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            10. MODIFICACIONES A LA POLÍTICA DE PRIVACIDAD
          </h2>
          <p className="text-gray-300">
            Esta política puede cambiar. Los cambios serán informados en
            nuestros canales. Su uso continuo implica aceptación de las
            modificaciones.
          </p>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            11. PROCEDIMIENTO PARA EJERCER SUS DERECHOS
          </h2>
          <p className="text-gray-300">
            Puede ejercer sus derechos escribiendo a:
          </p>
          <ul className="list-disc ml-5 mt-2 text-gray-300">
            <li>Correo: info@hunt-tickets.com</li>
            <li>
              WhatsApp:{" "}
              <a
                href="https://api.whatsapp.com/send/?phone=+573228597640"
                className="text-green-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +57 322 8597640
              </a>
            </li>
            <li>Asunto: “Protección de Datos – [Nombre completo]”</li>
          </ul>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            12. LEY APLICABLE Y JURISDICCIÓN
          </h2>
          <p className="text-gray-300">
            Esta política se rige por la legislación colombiana. En caso de
            disputa, la jurisdicción será la de Bogotá D.C.
          </p>
        </section>

        <hr className="border-t border-gray-300" />

        <section>
          <h2 className="text-xl font-semibold text-gray-400">
            13. ACEPTACIÓN
          </h2>
          <p className="text-gray-300">
            El usuario acepta esta política al registrarse, navegar o usar
            cualquiera de nuestros servicios.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
