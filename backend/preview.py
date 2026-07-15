#!/usr/bin/env python3
# Локальный dev-превью: раздаёт ../site + заглушки /api/lead и /api/health,
# чтобы проверять формы без боевого бэкенда. Запуск: python3 backend/preview.py
# (порт из env PORT, по умолч. 4310). Прод-логику см. в backend/server.mjs.
import json, os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "site")
PORT = int(os.environ.get("PORT", "4310"))


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/api/health"):
            return self._json(200, {"ok": True, "tg": False, "preview": True})
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/lead"):
            n = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(n) if n else b""
            try:
                data = json.loads(raw or b"{}")
            except Exception:
                data = {"_parse_error": True}
            print("[preview] LEAD:", json.dumps(data, ensure_ascii=False), flush=True)
            return self._json(200, {"ok": True})
        return self._json(404, {"ok": False})

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print(f"preview on http://127.0.0.1:{PORT} serving {ROOT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
