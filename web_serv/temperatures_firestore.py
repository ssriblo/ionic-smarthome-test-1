import os    
import configparser
import platform

config = configparser.ConfigParser()                                     
config.read('./config.ini')

location = config.get('MODE', 'LOCATION')
print ("[temperature_firestore] location", location)
if location == "local":
    platform = platform.system()
    print("[temperature_firestore] platform: ", platform)
    if platform == "Windows":
        credential_path = config.get('GOOGLE_APPLICATION_CREDENTIALS_FILE', 'WINDOWS')
        credential_path = credential_path.strip('\"')
        print("[temperature_firestore] windows")
    elif platform == "Linux":
        credential_path = config.get('GOOGLE_APPLICATION_CREDENTIALS_FILE', 'LINUX')
    #    credential_path = credential_path.strip('\"') # ???QUESTION??? Did not check at Linux yet. BUT, it need for Windows !!!!!!!!!!!!!!!!!!!!!!!!!
        print("[temperature_firestore] linux")
        print("[temperature_firestore] credential_path: ", credential_path)
else:
        credential_path = config.get('GOOGLE_APPLICATION_CREDENTIALS_FILE', 'LINUX')
        print("[temperature_firestore] linux-cloud")
        print("[temperature_firestore] credential_path: ", credential_path)

# Project ID is determined by the GCLOUD_PROJECT environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

from google.cloud import firestore
from weather_temp import Weather

class TempVal():
    # This is set for temperatures
    _targetT: int
    _weatherT: int
    _roomT: int
    _comfortT: int
    _economT: int
    _waterT: int
    _serversStatus: int
    apartment = u'test-apartment-135'
    db = None
    WT = None

    def __init__(self):
        self.WT = Weather()
        self.db = firestore.Client()
        doc_ref = self.db.collection(u'smarthome').document(self.apartment) # Let apartment=133 for test only
        doc = doc_ref.get()
        if doc.exists:
            print(f'[temperature_firestore] Document data: {doc.to_dict()}', self.apartment)
        else:
            print(u'No such apartment:', self.apartment)
            doc_ref.set({
            'targetT': 21,
            'weatherT': 12,
            'roomT': 23,
            'comfortT': 24,
            'economT': 14,
            'waterT': 35,
            })
            doc_ref = self.db.collection(u'smarthome').document(self.apartment)

    def fs_ref(self):
        return self.db.collection(u'smarthome').document(self.apartment)

######################################
    @property
    def targetT(self):
        self._targetT = self.fs_ref().get().to_dict()['targetT']
        return self._targetT

    @targetT.setter
    def targetT(self, val):
        self._targetT = val
        self.fs_ref().set({'targetT': val}, merge=True)
######################################
    @property
    def weatherT(self):
        weather_temp = "%.1f" % (self.WT.request_current_weather(520555,) ) # 520555 - Nizhniy Novgorod
        print("NN temp:", weather_temp)
        return weather_temp
#    @property
#    def weatherT(self):
#        self._weatherT = self.fs_ref().get().to_dict()['weatherT']
#        return self._weatherT
#
#    @weatherT.setter
#    def weatherT(self, val):
#        self._weatherT = val
#        self.fs_ref().set({'weatherT': val}, merge=True)      
######################################
    @property
    def roomT(self):
        self._roomT = self.fs_ref().get().to_dict()['roomT']
        return self._roomT

    @roomT.setter
    def roomT(self, val):
        self._roomT = val
        self.fs_ref().set({'roomT': val}, merge=True)
######################################
    @property
    def comfortT(self):
        self._comfortT = self.fs_ref().get().to_dict()['comfortT']
        return self._comfortT

    @comfortT.setter
    def comfortT(self, val):
        self._comfortT = val
        self.fs_ref().set({'comfortT': val}, merge=True)
######################################
    @property
    def economT(self):
        self._economT = self.fs_ref().get().to_dict()['economT']
        return self._economT

    @economT.setter
    def economT(self, val):
        self._economT = val
        self.fs_ref().set({'economT': val}, merge=True)
######################################
    @property
    def waterT(self):
        self._waterT = self.fs_ref().get().to_dict()['waterT']
        return self._waterT

    @waterT.setter
    def waterT(self, val):
        self._waterT = val
        self.fs_ref().set({'waterT': val}, merge=True)
######################################
    @property
    def serversStatus(self):
        self._serversStatus = self.fs_ref().get().to_dict()['serversStatus']
        return self._serversStatus

    @serversStatus.setter
    def serversStatus(self, val):
        self._serversStatus = val
        self.fs_ref().set({'serversStatus': val}, merge=True)
######################################


 