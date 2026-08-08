Exit code: 0
Wall time: 1.1 seconds
Output:
/**
 * JavaScript API and static-file server. No external dependencies required.
 * Run: node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = __dirname;
const port = Number(process.env.PORT || 4173);
const archive = {
  subject: 'Muzan Kibutsuji', designation: 'First Demon', spoilerWarning: true,
  entries: ['Heian-era origin', 'Demon progenitor', 'Twelve Kizuki', 'Blue Spider Lily search', 'Sunlight weakness']
};
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };
function json(response, value) { response.writeHead(200, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); response.end(JSON.stringify(value)); }
function cEngineStatus() {
  const executable = path.join(root, process.platform === 'win32' ? 'archive_engine.exe' : 'archive_engine');
  if (!fs.existsSync(executable)) return { engine: 'javascript', cService: 'optional / not compiled' };
  const run = spawnSync(executable, ['stats'], { encoding: 'utf8', timeout: 1000 });
  if (run.status !== 0) return { engine: 'javascript', cService: 'unavailable' };
  try { return { engine: 'c', cService: JSON.parse(run.stdout) }; } catch { return { engine: 'javascript', cService: 'invalid response' }; }
}
http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (requestUrl.pathname === '/api/archive') return json(response, archive);
  if (requestUrl.pathname === '/api/system') return json(response, cEngineStatus());
  const safePath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const file = path.resolve(root, `.${safePath}`);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404); return response.end('Not found'); }
  response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
}).listen(port, () => console.log(`Muzan Archive running at http://localhost:${port}`));

