import cgi
import cgitb
import json
class HttpServerCGI:
    def __init__(self):
        self.__form = cgi.FieldStorage()
        pass
    def exportHeadType(self,type='json'):
        typeDicRes = {
            "html":"Content-type:text/html\r\n\r\n",
            "xml":"Content-type:text/xml\r\n\r\n",
            "json":"Content-type:application/json\r\n\r\n"
        }
        typeDicRes = typeDicRes[type]
        print(typeDicRes,"\nUser-Agent:python client\r\n\r\n","\nAccess-Control-Allow-Origin:*\r\n\r\n","\nAccess-Control-Allow-Headers:Content-Type, Accept\r\n\r\n","\nAccess-Control-Allow-Methods:GET, POST, PUT, DELETE\r\n\r\n","\nAccess-Control-Max-Age:30 * 24 * 3600\r\n\r\n")
        pass
    def handlerForm(self,response):
        response = json.dumps(response)
        print(response)
        pass
    pass