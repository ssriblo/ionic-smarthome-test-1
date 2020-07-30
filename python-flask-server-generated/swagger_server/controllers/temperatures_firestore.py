import pprint
import os    
credential_path = "/media/me/86D07263D072597F/OVK/SwaggerAPI/104/web-serv13802-c8a969d5a2ed.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path
from google.cloud import firestore
# Project ID is determined by the GCLOUD_PROJECT environment variable
db = firestore.Client()
pp = pprint.PrettyPrinter(indent=4)

class TempVal():
    # This is set for temperatures
    _targetT: int
    _weatherT: int
    _airT: int
    _comfortT: int
    _economT: int
    _waterT: int
    apartment = u'test-apartment-135'

    def __init__(self):
        doc_ref = db.collection(u'smarthome').document(self.apartment) # Let apartment=133 for test only
        doc = doc_ref.get()
        if doc.exists:
            print(f'Document data: {doc.to_dict()}', self.apartment)
        else:
            print(u'No such apartment:', self.apartment)
            doc_ref.set({
            'targetT': 21,
            'weatherT': 12,
            'airT': 23,
            'comfortT': 24,
            'economT': 14,
            'waterT': 35,
            })
            doc_ref = db.collection(u'smarthome').document(self.apartment)

    def fs_ref(self):
        return db.collection(u'smarthome').document(self.apartment)

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
        doc = db.collection(u'smarthome').document(self.apartment).get()
        self._weatherT = doc.to_dict()['weatherT']
        return self._weatherT

    @weatherT.setter
    def weatherT(self, val):
        self._weatherT = val
        self.fs_ref().set({'weatherT': val}, merge=True)
######################################
    @property
    def airT(self):
        doc = db.collection(u'smarthome').document(self.apartment).get()
        self._airT = doc.to_dict()['airT']
        return self._airT

    @airT.setter
    def airT(self, val):
        self._airT = val
        self.fs_ref().set({'airT': val}, merge=True)
######################################
    @property
    def comfortT(self):
        doc = db.collection(u'smarthome').document(self.apartment).get()
        self._comfortT = doc.to_dict()['comfortT']
        return self._comfortT

    @comfortT.setter
    def comfortT(self, val):
        self._comfortT = val
        self.fs_ref().set({'comfortT': val}, merge=True)
######################################
    @property
    def economT(self):
        doc = db.collection(u'smarthome').document(self.apartment).get()
        self._economT = doc.to_dict()['economT']
        return self._economT

    @economT.setter
    def economT(self, val):
        self._economT = val
        self.fs_ref().set({'economT': val}, merge=True)
######################################
    @property
    def waterT(self):
        doc = db.collection(u'smarthome').document(self.apartment).get()
        self._waterT = doc.to_dict()['waterT']
        return self._waterT

    @waterT.setter
    def waterT(self, val):
        self._waterT = val
        self.fs_ref().set({'waterT': val}, merge=True)
######################################


 