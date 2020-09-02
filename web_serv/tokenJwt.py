import os    
import configparser
import platform
import jwt
#from token import Token
import tokenJwt

class Token():
    _token = ""
    __jwt_secret = ""

    def __init__(self):
        config = configparser.ConfigParser()                           
        config.read('./config.ini')
        location = config.get('MODE', 'LOCATION')
        print ("[TokenJwt] location", location)
        if location == "local":
            __platform = platform.system()
            print("[TokenJwt] platform", platform)
            if __platform == "Windows":
                self.__jwt_secret = config.get('JWT_SECRET', 'WINDOWS')
                self.__jwt_secret = self.__jwt_secret.strip('\"')
                print("[TokenJwt] windows")
            elif __platform == "Linux":
                self.__jwt_secret = config.get('JWT_SECRET', 'LINUX')
                print("[TokenJwt] linux")
        else:
            self.__jwt_secret = config.get('JWT_SECRET', 'LINUX')
            print("[TokenJwt] cloud-linux")
        
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





