<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-f5c842?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/vanilla-JS-3d8bff?style=for-the-badge&logo=javascript&logoColor=white"/>
<img src="https://img.shields.io/badge/Google%20Sheets-API-00e5a0?style=for-the-badge&logo=googlesheets&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub%20Pages-deploy-818cf8?style=for-the-badge&logo=githubpages&logoColor=white"/>

<br/><br/>

<h1>
  <img src="https://img.shields.io/badge/%E2%82%BF-Reto%20Ahorro%208M-f5c842?style=flat-square&labelColor=0e1420&color=f5c842" height="36"/>
</h1>

<p><strong>Aplicacion web fintech para llevar el control de tu reto de ahorro de $8.000.000 COP</strong></p>
<p>200 casillas · Login con PIN seguro · Sincronizacion en la nube con Google Sheets · Sin backend tradicional</p>

<br/>

</div>

---

## Capturas de pantalla

<table>
  <tr>
    <td align="center" width="50%">
      <img width="362" height="577" alt="image" src="https://github.com/user-attachments/assets/c62be78d-2dd8-43a5-ae88-21fdb568944a" />
      <br/>
      <sub><b>Pantalla de acceso con PIN seguro</b></sub>
    </td>
    <td align="center" width="50%">
      <img width="979" height="590" alt="image" src="https://github.com/user-attachments/assets/96d5f551-5885-4dbe-904b-436c906f4a88" />
      <br/>
      <sub><b>Dashboard con grid de 200 casillas</b></sub>
    </td>
  </tr>
</table>

---

## Descripcion

**Reto Ahorro 8M** es una aplicacion web 100% del lado del cliente que te ayuda a completar un reto de ahorro de **$8.000.000 COP** mediante 200 casillas con montos variados. Cada casilla que marcas representa dinero que has guardado, y el progreso se sincroniza automaticamente con Google Sheets como base de datos en la nube.

No requiere servidor propio ni base de datos SQL. Todo funciona con HTML, CSS y JavaScript puro, usando Google Apps Script como API REST.

---

## Caracteristicas

- **Login con PIN de 4 digitos** — codigo almacenado con hash djb2, nunca en texto plano
- **200 casillas distribuidas** en 8 montos distintos con un total exacto de $8.000.000
- **Casillas de un solo toque** — una vez marcada no se puede desmarcar por error
- **Sincronizacion en la nube** via Google Sheets + Apps Script
- **Persistencia local** con `localStorage` para uso sin conexion
- **Dashboard en tiempo real** con total ahorrado, faltante, porcentaje y anillo de progreso
- **Barra de progreso animada** con hitos en 25%, 50% y 75%
- **Filtros** por todas / pendientes / completadas
- **Modo oscuro y claro** con persistencia
- **Animaciones** al marcar casillas (pop + particulas de color)
- **Responsive** para movil, tablet y escritorio
- **Sin emojis** — iconografia con Font Awesome 6
- **Listo para GitHub Pages**

---

## Distribucion de casillas

| Monto | Cantidad | Subtotal |
|-------|----------|----------|
| $2.000 | 20 | $40.000 |
| $5.000 | 20 | $100.000 |
| $10.000 | 30 | $300.000 |
| $20.000 | 30 | $600.000 |
| $33.000 | 20 | $660.000 |
| $50.000 | 30 | $1.500.000 |
| $80.000 | 30 | $2.400.000 |
| $120.000 | 20 | $2.400.000 |
| **Total** | **200** | **$8.000.000** |

---

## Arquitectura

```
Frontend (GitHub Pages)
│
├── index.html       — Estructura HTML, login + app
├── style.css        — Estilos fintech dark/light mode
└── app.js           — Logica, PIN hash, API calls
        │
        └──► Google Apps Script (API REST)
                    │
                    └──► Google Sheets (base de datos)
```

**Sin Node.js. Sin SQL. Sin servidor propio.**

---

## Instalacion rapida

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/reto-ahorro-8m.git
cd reto-ahorro-8m
```

### 2. Crear el Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com) e inicia sesion
2. Crea una hoja nueva — llamala **Reto Ahorro 8M**
3. Las columnas se crean solas la primera vez que uses la app

### 3. Crear el Apps Script

1. Dentro del Sheet: **Extensiones → Apps Script**
2. Borra el contenido del archivo `Codigo.gs`
3. Pega el contenido del archivo `Codigo.gs` de este repositorio
4. Guarda con `Ctrl+S`

### 4. Publicar como Web App

1. Haz clic en **Implementar → Nueva implementacion**
2. Tipo: **Aplicacion web**
3. Ejecutar como: **Yo**
4. Acceso: **Cualquier usuario**
5. Haz clic en **Implementar** y copia la URL generada

### 5. Conectar la URL en app.js

Abre `app.js` y reemplaza la constante `API_URL`:

```js
const API_URL = 'https://script.google.com/macros/s/TU_ID_AQUI/exec';
```

### 6. Publicar en GitHub Pages

1. Sube los archivos `index.html`, `style.css`, `app.js` al repositorio
2. Ve a **Settings → Pages**
3. Source: **main branch → / (root)**
4. Tu app quedara disponible en:

```
https://tu-usuario.github.io/reto-ahorro-8m/
```

---

## Uso

| Accion | Descripcion |
|--------|-------------|
| Ingresa el PIN `****` | Accede a la aplicacion |
| Haz clic en una casilla | La marca como completada (no se puede deshacer) |
| Boton de filtros | Ver todas / pendientes / completadas |
| Icono de sol/luna | Cambiar entre modo oscuro y claro |
| Icono de reiniciar | Borra todo el progreso (pide confirmacion) |
| Icono de salir | Cierra la sesion y vuelve al login |

---

## Stack tecnologico

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estructura semantica |
| CSS3 | Variables, Grid, animaciones, responsive |
| JavaScript ES2022 | Logica, fetch API, localStorage |
| Google Apps Script | API REST serverless |
| Google Sheets | Base de datos en la nube |
| Font Awesome 6 | Iconografia |
| Google Fonts (Outfit + JetBrains Mono) | Tipografia |

---

## Seguridad del PIN

El codigo de acceso **no se almacena en texto plano**. Se guarda como un hash numerico usando el algoritmo **djb2**:

```js
// El PIN **** se almacena como su valor hash
const _H = (s) => [...s].reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 5381);
const _PIN_HASH = _H('****');
```

La verificacion compara hashes, nunca el PIN directamente. La sesion se guarda en `sessionStorage` y se borra al cerrar el navegador.

---

## Estructura de archivos

```
reto-ahorro-8m/
├── index.html              — App completa (login + dashboard)
├── style.css               — Estilos (dark/light, responsive, animaciones)
├── app.js                  — Logica principal + integracion API
├── Codigo.gs               — Google Apps Script (backend)
├── screenshot-login.png    — Captura de la pantalla de login
├── screenshot-dashboard.png — Captura del dashboard
└── README.md               — Este archivo
```

---

## API — Endpoints

El Apps Script expone dos metodos:

**GET** — Obtener todas las casillas
```
GET https://script.google.com/.../exec?action=getAll
```
```json
{
  "casillas": [
    { "id": 1, "monto": 50000, "completada": false, "fechaActualizacion": null }
  ]
}
```

**POST** — Actualizar una casilla
```json
{ "action": "update", "id": 1, "monto": 50000, "completada": true, "fechaActualizacion": "2025-01-01T..." }
```

**POST** — Reiniciar todas
```json
{ "action": "resetAll" }
```

---

## Licencia

MIT — libre para uso personal y comercial.

---

<div align="center">

Desarrollado con dedicacion por **Deison Bm**

<img src="https://img.shields.io/badge/Hecho%20con-dedicacion-f5c842?style=flat-square&labelColor=0e1420"/>

</div>
