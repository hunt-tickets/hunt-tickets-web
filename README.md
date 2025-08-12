# VTickets - Plataforma de Venta de Tickets

![VTickets Logo](public/logo.png)

VTickets es una plataforma moderna para la venta y gestión de tickets de eventos, construida con Next.js 15 y Supabase.

🌐 [Visitar VTickets](https://vtickets.vercel.app)

## 🚀 Características Principales

- Autenticación segura con número de teléfono (OTP)
- Gestión de eventos y tickets
- Panel de administración para productores
- Sistema de vendedores
- Integración con pasarelas de pago
- Diseño responsive y moderno

## 🛠️ Tecnologías

- **Frontend:**

  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui

- **Backend:**

  - Supabase (Base de datos y Autenticación)
  - Next.js Server Actions
  - API Routes

- **Infraestructura:**
  - Vercel (Hosting)
  - Supabase (Base de datos PostgreSQL)

## 📋 Prerrequisitos

1. Node.js 18.17 o superior
2. Cuenta en Supabase
3. Cuenta en Vercel (para deploy)

## ⚙️ Configuración Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/vtickets.git
   cd vtickets
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear archivo `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🗄️ Estructura del Proyecto

```
vtickets/
├── app/                    # App router y páginas
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y helpers
├── public/               # Archivos estáticos
├── styles/              # Estilos globales
├── supabase/           # Configuración de Supabase
└── types/              # Definiciones de tipos
```

## 📱 Características de Autenticación

- Registro/Login con número de teléfono
- Verificación OTP vía SMS
- Gestión de sesiones
- Rutas protegidas
- Roles de usuario (Admin, Productor, Vendedor)

## 🚀 Deployment

El proyecto está configurado para deploy automático en Vercel:

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en Vercel
3. Vercel automáticamente construirá y desplegará tu aplicación

## 📄 API y Endpoints

Documentación de endpoints principales:

- `/api/events` - Gestión de eventos
- `/api/tickets` - Gestión de tickets
- `/api/users` - Gestión de usuarios
- `/api/sales` - Gestión de ventas

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles

## 📞 Soporte

Para soporte y consultas:

- Email: tu@email.com
- Twitter: [@tu_usuario](https://twitter.com/tu_usuario)
- Website: [tu-sitio.com](https://tu-sitio.com)

## 🙏 Agradecimientos

- [Next.js Team](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Shadcn/ui](https://ui.shadcn.com)

---

Desarrollado con ❤️ por [Tu Nombre/Empresa]
