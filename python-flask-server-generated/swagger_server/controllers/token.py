import os    
import configparser
import platform
import jwt

class Token():
    _token = ""
    __jwt_secret = ""

    def __init__(self):
        config = configparser.ConfigParser()                                     
        config.read('../config.ini')
        __platform = platform.system()
        print("platform", platform)
        if __platform == "Windows":
            self.__jwt_secret = config.get('JWT_SECRET', 'WINDOWS')
            self.__jwt_secret = self.__jwt_secret.strip('\"')
            print("windows")
        elif __platform == "Linux":
            self.__jwt_secret = config.get('JWT_SECRET', 'LINUX')
            print("linux")
######################################
    def __parserJwt(self, jwtString):
        try:
            __decoded = jwt.decode(jwtString, self.__jwt_secret, algorithms=['HS256'])
            print(">>>>>>>>>> 15 _decoded JWT: ", __decoded)
            return __decoded
        except Exception as e:
            print("Exception (jwtString):", e)
            return None

    def __getApartID(self, jsonJwt, key):
        return jsonJwt[key]
        pass

    def getName(self, jwtString):
        pass
    
    def getTokenNumber(self, jwtString):
        pass

    def getProject(self, jwtString):
        pass

    def isJwtToken(self, jwtString):
        _d = self.__parserJwt(jwtString)
        if (_d != None):
            return self.__getApartID(_d, "apartID")
        else:
            return None




