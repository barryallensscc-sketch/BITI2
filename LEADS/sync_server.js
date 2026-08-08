const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const LEADS_DIR = __dirname;
const FILE_PATH = path.join(LEADS_DIR, 'Genaral Leads.csv');

// Helper to write CSV line
function appendToCSV(lead) {
  const fileExists = fs.existsSync(FILE_PATH);
  
  // Format columns safely
  const escapeCSV = (val) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Interested Course', 'Message'];
  const row = [
    lead.id,
    new Date(lead.createdAt || Date.now()).toLocaleString(),
    lead.name,
    lead.email,
    lead.phone,
    lead.course,
    lead.message
  ].map(escapeCSV).join(',');

  if (!fileExists) {
    // Write UTF-8 BOM so Excel opens non-ASCII characters correctly
    fs.writeFileSync(FILE_PATH, '\ufeff' + headers.map(escapeCSV).join(',') + '\n', 'utf8');
  }
  
  fs.appendFileSync(FILE_PATH, row + '\n', 'utf8');
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/lead') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const lead = JSON.parse(body);
        appendToCSV(lead);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Lead saved to Genaral Leads.csv' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Leads Sync Server running at http://localhost:${PORT}`);
  console.log(`Leads will be saved to: ${FILE_PATH}`);
});
