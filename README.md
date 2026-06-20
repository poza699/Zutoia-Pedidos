# Zutoia · Pedido a proveedor

App para ir marcando lo que falta en el bar y enviarlo directamente por WhatsApp a cada proveedor (Kodeka, Medalla de Oro, Ondarru...).

## Probarlo en tu ordenador

Necesitas tener [Node.js](https://nodejs.org/) instalado (versión 18 o superior).

```bash
npm install
npm run dev
```

Abre la URL que te indique la terminal (normalmente `http://localhost:5173`).

## Subirlo a GitHub

```bash
git init
git add .
git commit -m "Primera versión de la app de pedidos"
```

Luego crea un repositorio nuevo en GitHub (botón "New repository", sin marcar ningún checkbox) y sigue las instrucciones que te da GitHub para conectar tu carpeta local con el repositorio remoto (algo como):

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

## Desplegarlo en Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. "Add New..." → "Project".
3. Elige el repositorio que acabas de subir.
4. Vercel detecta automáticamente que es un proyecto Vite — no hace falta tocar nada de configuración.
5. Dale a "Deploy". En un par de minutos tendrás una URL pública (algo como `zutoia-pedidos.vercel.app`) que funciona igual en el móvil.

Cada vez que hagas `git push` con cambios, Vercel actualiza la web sola.

## Cómo funciona el guardado

Todo lo que añadas, edites o borres (familias, productos, proveedores) se guarda automáticamente en el almacenamiento local del navegador (`localStorage`). Esto significa:

- Los datos se quedan guardados aunque cierres la pestaña o el móvil.
- Los datos viven en **ese navegador y dispositivo concreto**. Si abres la app desde otro móvil u otro navegador, no verá los mismos cambios automáticamente.

## Exportar / Importar (copia de seguridad y traspaso entre dispositivos)

En **Ajustes** tienes dos botones:

- **Exportar JSON**: descarga un archivo con todo tu catálogo y pedidos en curso. Puedes guardarlo en Google Drive, enviártelo por correo, etc.
- **Importar JSON**: carga un archivo exportado previamente. Útil para:
  - Hacer una copia de seguridad antes de cambiar muchas cosas.
  - Pasar tu catálogo a otro móvil u ordenador (exportas en uno, importas en el otro).
  - Recuperar tus datos si borras el caché del navegador.

## Estructura del proyecto

```
├── index.html
├── package.json
├── src/
│   ├── App.jsx        ← toda la lógica y el diseño de la app
│   ├── main.jsx        ← punto de entrada de React
│   └── index.css        ← estilos base (Tailwind)
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```
