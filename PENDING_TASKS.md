# 🚀 TiendaBici – Pendientes y Conexiones Finales

Este documento detalla las configuraciones y funcionalidades restantes para llevar la aplicación de un entorno local de desarrollo a una operación comercial real en producción.

---

## 🔗 1. Conexiones y Producción (Hosting)
Para que el mundo vea la tienda, hay que realizar el "Deploy" (despliegue):

- [ ] **Hospedaje en Vercel:** Conectar el repositorio de GitHub con [Vercel](https://vercel.com).
    - Es gratis inicialmente y está optimizado para Next.js.
    - **Configuración de Variables de Entorno:** Hay que copiar todas las variables del `.env.local` a la consola de Vercel (Supabase Keys, MercadoPago Token, Resend Key).
- [ ] **Dominio Propio:** Comprar y configurar un dominio (ej. `www.tiendabici.cl`) y apuntarlo a los servidores de Vercel.

---

## 🛠 2. Configuraciones de Terceros (API Keys Reales)
Actualmente, el código tiene "placeholders" o llaves de prueba. Antes de vender, debes cambiar:

- [ ] **MercadoPago (Cuentas Reales):**
    - Pasar del `Access Token` de prueba al de **Producción** en el panel de desarrolladores de MercadoPago.
    - Configurar la URL del **Webhook** en MercadoPago apuntando a `https://tu-dominio.com/api/mp-webhook`.
- [ ] **Resend (Correos):**
    - Autenticar tu dominio en Resend para que los correos no lleguen a la carpeta de Spam.
    - Cambiar el remitente `onboarding@resend.dev` por uno institucional (ej. `ventas@tiendabici.cl`).
- [ ] **Analytics & Pixel (Marketing):**
    - En `src/app/layout.tsx`, buscar `G-XXXXXXXXXX` y `XXXXXXXXXXXXXXXX` y reemplazarlos por tus IDs reales de Google Analytics y Meta Pixel respectivamente.

---

## ✨ 3. Funcionalidades de "Fase 2" (Opcionales)
Si el negocio crece y quieres mejorar la experiencia del cliente:

- [ ] **Edición de Fotos en Admin:** Actualmente puedes crear productos con varias fotos, pero no hay un panel de "Editar Producto" para cambiar fotos de productos ya existentes (solo eliminarlos y volver a crearlos).
- [ ] **Cuentas de Cliente Avanzadas:** 
    - [ ] Recuperación de contraseña vía email ("Olvidé mi contraseña").
    - [ ] Guardar direcciones de envío favoritas en el perfil.
- [ ] **Filtros por Precio y Marca:** Actualmente los filtros son por categoría. Se podría añadir un "range slider" para filtrar por presupuesto.
- [ ] **Módulo de Inventario Admin:** Panel para ver qué productos tienen menos de 5 unidades y recibir una alerta automática al correo.

---

## 🔐 4. Seguridad de la Base de Datos
- [ ] **RLS (Row Level Security):** Ya está configurado inicialmente en Supabase, pero una vez en producción se recomienda monitorear que solo los administradores autorizados puedan modificar la tabla de `products` y `coupons`.

---

¡Felicidades por llegar hasta aquí! El motor central de la tienda está 100% activo y probado. 🚵‍♂️💨
