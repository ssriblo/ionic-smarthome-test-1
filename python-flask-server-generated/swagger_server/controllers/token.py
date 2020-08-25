import os    
import configparser
import platform


class Token():
    _token = ""
    __jwt_secret = ""

    def __init__(self):
        JWT_SECRET
        config = configparser.ConfigParser()                                     
        config.read('../config.ini')
        __platform = platform.system()
        print("platform", platform)
        if __platform == "Windows":
            __jwt_secret = config.get('JWT_SECRET', 'WINDOWS')
            __jwt_secret = __jwt_secret.strip('\"')
            print("windows")
        elif __platform == "Linux":
            __jwt_secret = config.get('JWT_SECRET', 'LINUX')
            print("linux")




######################################
    def __getApartID(jwt)
        pass

    def getName(jwt)
        pass
    
    def getTokenNumber(jwt)
        pass

    def getProject(jwt)
        pass

    def isJwtToken(jwt)
        # TODO: check JWT format
        return self.__getApartID(jwt)




