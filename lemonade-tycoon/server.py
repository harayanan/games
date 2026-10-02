#!/usr/bin/env python3
"""Static HTTP server for the Lemonade Tycoon game (public, no auth)."""
import http.server
import os

PORT = 9114
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".ico": "image/x-icon",
    ".json": "application/json",
}


class StaticHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.strip("/").split("?")[0]
        if path == "":
            path = "index.html"

        filepath = os.path.join(BASE_DIR, path)

        # Prevent directory traversal
        if not os.path.realpath(filepath).startswith(os.path.realpath(BASE_DIR)):
            self._send_404()
            return

        if not os.path.isfile(filepath):
            self._send_404()
            return

        ext = os.path.splitext(filepath)[1].lower()
        content_type = MIME_TYPES.get(ext, "application/octet-stream")

        with open(filepath, "rb") as f:
            body = f.read()

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_404(self):
        self.send_response(404)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Not found")

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    os.chdir(BASE_DIR)
    server = http.server.HTTPServer(("0.0.0.0", PORT), StaticHandler)
    print(f"Serving lemonade-tycoon on port {PORT}")
    server.serve_forever()
