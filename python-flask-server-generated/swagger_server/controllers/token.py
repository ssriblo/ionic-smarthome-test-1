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
        print(">>>>>>>>> 14 __jwt_secret: ",  self.__jwt_secret)
######################################
    def __parserJwt(self, jwtString):
        print(">>>>>>>>> 12 jwtString: ", jwtString, type(jwtString), self.__jwt_secret)
        __decoded = jwt.decode(jwtString, self.__jwt_secret, algorithms=['HS256'])
        print(__decoded)

        pass

    def __getApartID(self, jwtString):
        pass

    def getName(self, jwtString):
        pass
    
    def getTokenNumber(self, jwtString):
        pass

    def getProject(self, jwtString):
        pass

    def isJwtToken(self, jwtString):
        self.__parserJwt(jwtString)
        # TODO: check jwtString format
        return self.__getApartID(jwtString)




