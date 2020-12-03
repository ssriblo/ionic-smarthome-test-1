from sqlitedict import SqliteDict

class TempValLocal():
    mydict = None

    def __init__(self):
        # https://pypi.org/project/sqlitedict/
        # If you don’t use autocommit (default is no autocommit for performance), then don’t forget to call mydict.commit() when done with a transaction:
        self.mydict = SqliteDict('../my_db.sqlite', autocommit=True)
        if 'targetT' not in self.mydict: 
            self.mydict['targetT'] = 21
        if 'roomT' not in self.mydict: 
            self.mydict['roomT'] = 23
        if 'comfortT' not in self.mydict: 
            self.mydict['comfortT'] = 24
        if 'economT' not in self.mydict: 
            self.mydict['economT'] = 14
        if 'waterT' not in self.mydict: 
            self.mydict['waterT'] = 35
######################################
    @property
    def targetT(self):
        return self.mydict['targetT']

    @targetT.setter
    def targetT(self, val):
        self.mydict['targetT'] = val
######################################
    @property
    def roomT(self):
        return self.mydict['roomT']

    @roomT.setter
    def roomT(self, val):
        self.mydict['roomT'] = val
######################################
    @property
    def comfortT(self):
        return self.mydict['comfortT']

    @comfortT.setter
    def comfortT(self, val):
        self.mydict['comfortT'] = val
######################################
    @property
    def economT(self):
        return self.mydict['economT']

    @economT.setter
    def economT(self, val):
        self.mydict['economT'] = val
######################################
    @property
    def waterT(self):
        return self.mydict['waterT']

    @waterT.setter
    def waterT(self, val):
        self.mydict['waterT'] = val
######################################
    @property
    def serversStatus(self):
        return self.mydict['serversStatus']

    @serversStatus.setter
    def serversStatus(self, val):
        self.mydict['serversStatus'] = val
######################################
    @property
    def mercutyV1(self):
        return self.mydict['mercutyV1']

    @mercutyV1.setter
    def mercutyV1(self, val):
        self.mydict['mercutyV1'] = val
######################################
    @property
    def mercutyV2(self):
        return self.mydict['mercutyV2']

    @mercutyV2.setter
    def mercutyV2(self, val):
        self.mydict['mercutyV2'] = val
######################################
    @property
    def proteyW(self):
        return self.mydict['proteyW']

    @proteyW.setter
    def proteyW(self, val):
        self.mydict['proteyW'] = val
######################################
    @property
    def weatherT(self):
        return self.mydict['weatherT']
        
    @weatherT.setter
    def weatherT(self, val):
        self.mydict['weatherT'] = val
######################################
    @property
    def flags1(self):
        return self.mydict['flags1']

    @flags1.setter
    def flags1(self, val):
        self.mydict['flags1'] = val
######################################
    @property
    def flags2(self):
        return self.mydict['flags2']

    @flags2.setter
    def flags2(self, val):
        self.mydict['flags2'] = val
######################################


######################################
if __name__ == '__main__':
    # TESTING:
    TVL = TempValLocal()
    TVL.roomT = 21.8
    print(TVL.roomT)
    for key, value in TVL.mydict.iteritems():
        print (key, value)



