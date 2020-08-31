import os    
import configparser
import platform
import jwt

class Token():
    _token = ""
    __jwt_secret = ""

    def __init__(self):
        config = configparser.ConfigParser()                           
        config.read('./config.ini')
        location = config.get('MODE', 'LOCATION')
        print ("[Token] location", location)
        if location == "local":
            __platform = platform.system()
            print("[Token] platform", platform)
            if __platform == "Windows":
                self.__jwt_secret = config.get('JWT_SECRET', 'WINDOWS')
                self.__jwt_secret = self.__jwt_secret.strip('\"')
                print("[Token] windows")
            elif __platform == "Linux":
                self.__jwt_secret = config.get('JWT_SECRET', 'LINUX')
                print("[Token] linux")
        else:
            self.__jwt_secret = config.get('JWT_SECRET', 'LINUX')
            print("[Token] cloud-linux")
        
######################################
    def getToken(self, jwtString):
        try:
            __decoded = jwt.decode(jwtString, self.__jwt_secret, algorithms=['HS256'])
#            __decoded = jwt.decode(jwtString, "12345", algorithms=['HS256'])
            return __decoded 
        except Exception as e:
            print("Exception (jwtString):", e)
            return None

    def getApartID(self, jwtString):
        return self.getTokenAttribute(jwtString, "apartID")

    def getTokenAttribute(self, jwtString, attribute):
        _d = self.getToken(jwtString)
        return _d[attribute] if ( (_d != None ) and (attribute in _d) ) else None





