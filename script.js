import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ABUSEIPDB_API_KEY || "82e1b1e1bfc42d96f95dc8fcd1bb4317ebd18e56d684a28a8c293fb7c069e3d1cb7c04a4d81a51ec";

app.use(cors());
app.use(express.json());

// Endpoint para consultar AbuseIPDB sin exponer clave
app.get("/api/check-ip/:ip", async (req, res) => {
  const ip = req.params.ip;

  // Validación básica de IP
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  if (!ipRegex.test(ip)) {
    return res.status(400).json({ error: "IP inválida" });
  }

  try {
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`, {
      headers: {
        Accept: "application/json",
        Key: API_KEY,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error en AbuseIPDB API" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Error en backend:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});