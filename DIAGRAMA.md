# 🤖 Diagrama — Chatbot WhatsApp + CRM Google Sheets

> Versión texto plano del diagrama. Para la versión visual abrir `diagrama.html` en el navegador.

---

## 📨 Flujo completo de un mensaje

```
USUARIO escribe por WhatsApp
        │
        ▼
META CLOUD API recibe el mensaje
→ hace POST a: https://tuservidor.com/webhook
        │
        ▼
POST /webhook  (Express)
  ├─ Responde 200 OK a Meta inmediatamente
  └─ Parsea el body → extrae: from, text, name, messageId
        │
        ▼
bot.service.js (orquestador)
  ├─ normalizeText(text)          → sin tildes, minúsculas, limpio
  ├─ detectIntent(text)           → saludo | precio | compra | despedida
  │
  ├─ [si intención = precio o compra]
  │     └─ sheets.service.saveLead()   → guarda en Google Sheets
  │
  └─ whatsapp.service.sendMessage()   → responde al usuario
        │
        ▼
USUARIO recibe respuesta en WhatsApp
```

---

## 🏗️ Capas del sistema

```
┌──────────────────────────────────────────────────┐
│  ENTRADA              server.js + routes/         │
│  Express app, middlewares, rutas HTTP             │
├──────────────────────────────────────────────────┤
│  CONTROL              controllers/                │
│  Handlers HTTP, parseo del webhook                │
├──────────────────────────────────────────────────┤
│  ORQUESTACIÓN         services/bot.service.js     │
│  Une intención + CRM + respuesta WhatsApp         │
├──────────────────────────────────────────────────┤
│  LÓGICA DEL BOT       bot/intents.js              │
│  Keywords → intención → respuesta (sin IA)        │
├──────────────────────────────────────────────────┤
│  SERVICIOS EXTERNOS                               │
│  services/whatsapp.service.js  → Graph API        │
│  services/sheets.service.js    → Google Sheets    │
└──────────────────────────────────────────────────┘
```

---

## 🎯 Intenciones detectadas

| Intención    | Keywords ejemplo                         | ¿Guarda lead? |
|-------------|------------------------------------------|---------------|
| `saludo`    | hola, buenas, hey, buenos dias           | ❌ No         |
| `precio`    | precio, cuesta, valor, cotizar           | ✅ Sí         |
| `compra`    | quiero comprar, pedir, encargar          | ✅ Sí         |
| `despedida` | chau, adios, bye, hasta luego            | ❌ No         |
| `desconocido`| cualquier otro texto                    | ❌ No         |

---

## 📊 Columnas en Google Sheets (hoja: "Leads")

| Col | Campo      | Ejemplo                    |
|-----|------------|----------------------------|
| A   | Nombre     | Juan García                |
| B   | Teléfono   | 5491123456789              |
| C   | Mensaje    | cuanto cuesta el plan?     |
| D   | Intención  | precio                     |
| E   | Fecha      | 26/05/2026, 14:32          |

---

## 📡 Endpoints del servidor

| Método | Ruta            | Qué hace                                    |
|--------|-----------------|---------------------------------------------|
| GET    | /webhook        | Verificación Meta (devuelve hub.challenge)   |
| POST   | /webhook        | Recibe mensajes, procesa, responde           |
| GET    | /webhook/leads  | Lista todos los leads del CRM               |
| GET    | /health         | Status del servidor (uptime, timestamp)     |

---

## 🚀 Setup rápido (en equipo)

```
1. npm install
2. cp .env.example .env      ← completar variables
3. npm run dev               ← iniciar servidor
4. ngrok http 3000           ← exponer a internet
5. Meta Developers:
   → Webhook URL: https://xxx.ngrok.io/webhook
   → Verify Token: el mismo que en VERIFY_TOKEN del .env
   → Suscribir a evento: messages
6. Google Sheets:
   → Crear hoja llamada "Leads"
   → Compartir con el email de la cuenta de servicio
```

---

## 🗂️ Estructura de carpetas (referencia)

```
chatbot-whatsapp/
├── server.js                    ← entry point
├── .env                         ← variables de entorno (no subir a git)
├── .env.example                 ← template
├── config/
│   └── env.js                   ← carga y valida .env
├── routes/
│   └── webhook.routes.js        ← rutas GET y POST
├── controllers/
│   └── whatsapp.controller.js   ← handlers HTTP
├── services/
│   ├── bot.service.js           ← orquestador del flujo
│   ├── whatsapp.service.js      ← Graph API de Meta
│   └── sheets.service.js        ← Google Sheets CRM
├── bot/
│   └── intents.js               ← detección de intenciones
└── utils/
    └── normalizeText.js          ← normalización de texto
```

---

## 🔮 Próximas features (roadmap)

- [ ] Panel admin en Next.js para ver leads
- [ ] Multi-vendedores con asignación automática
- [ ] Flujos conversacionales (preguntas secuenciales)
- [ ] Integración con Instagram Direct
- [ ] Notificaciones push a vendedores
- [ ] Métricas de conversión por intención
