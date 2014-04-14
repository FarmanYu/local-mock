from http.server import HTTPServer, CGIHTTPRequestHandler
port = 8086
httpd = HTTPServer(('', port), CGIHTTPRequestHandler)
print('start http server')
httpd.serve_forever()