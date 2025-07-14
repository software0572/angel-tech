const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', '*'); next(); });
app.get('/validar-numero', async (req, res) => {
  try {
    const response = await fetch(`https://apilayer.net/api/validate?access_key=TU_CLAVE_NUMVERIFY&number=${encodeURIComponent(req.query.numero)}&format=1`);
    res.json(await response.json());
  } catch {
    res.status(500).json({ error: 'Error' });
  }
});
app.get('/whois', async (req, res) => {
  try {
    const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=TU_CLAVE_WHOISXML&domainName=${encodeURIComponent(req.query.domain)}&outputFormat=JSON`);
    res.json(await response.json());
  } catch {
    res.status(500).json({ error: 'Error' });
  }
});
app.listen(process.env.PORT || 3000);