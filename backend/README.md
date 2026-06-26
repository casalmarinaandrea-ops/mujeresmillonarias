# Mujeres Millonarias Backend

Backend para crear pagos con Mercado Pago Checkout Pro.

## Importante
No subas tu Access Token a GitHub. Pegalo solamente en Render como variable de entorno:

MP_ACCESS_TOKEN=tu_token_productivo

## Deploy en Render
1. Subí esta carpeta `backend` a un repositorio de GitHub.
2. En Render: New > Web Service.
3. Conectá el repo.
4. Build command: `npm install`
5. Start command: `npm start`
6. Environment variable: `MP_ACCESS_TOKEN`
7. Copiá la URL de Render.
8. En `frontend/script.js`, reemplazá:
   `https://TU-BACKEND-EN-RENDER.onrender.com`
   por tu URL real de Render.
