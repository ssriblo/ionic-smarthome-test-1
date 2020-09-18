import os    
import configparser
import platform
import jwt
import tokenJwt
import json

class Token():
    __jwt_secret = ""

    def __init__(self):
        credential_path = None
        config = configparser.ConfigParser()                           
        config.read('./config.ini')
        location = config.get('MODE', 'LOCATION')
        print ("[TokenJwt] location", location)
        if location == "local":
            __platform = platform.system()
            print("[TokenJwt] platform", platform)
            if __platform == "Windows":
                credential_path = config.get('JWT_SECRET_FILE', 'WINDOWS')
                credential_path = credential_path.strip('\"')
                print("[TokenJwt] windows")
            elif __platform == "Linux":
                credential_path = config.get('JWT_SECRET_FILE', 'LINUX')
                print("[TokenJwt] linux")
        else:
            credential_path = config.get('JWT_SECRET_FILE', 'LINUX')
            print("[TokenJwt] cloud-linux")
        
        with open(credential_path) as f:
            data = json.load(f)
        self.__jwt_secret = data["key"]
######################################
    def getToken(self, jwtString):
        try:
            __decoded = jwt.decode(jwtString, self.__jwt_secret, algorithms=['HS256'])
#            __decoded = jwt.decode(jwtString, "12345", algorithms=['HS256'])
            return __decoded 
        except Exception as e:
            print("[TokenJwt] Exception (jwtString):", e)
            return None

    def getApartID(self, jwtString):
        return self.getTokenAttribute(jwtString, "apartID")

    def getTokenAttribute(self, jwtString, attribute):
        _d = self.getToken(jwtString)
        return _d[attribute] if ( (_d != None ) and (attribute in _d) ) else None





