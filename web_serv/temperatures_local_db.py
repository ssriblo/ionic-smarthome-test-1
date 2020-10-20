from sqlitedict import SqliteDict

class TempValLocal():
    mydict = None

    def __init__(self):
        # https://pypi.org/project/sqlitedict/
        # If you don’t use autocommit (default is no autocommit for performance), then don’t forget to call mydict.commit() when done with a transaction:
        self.mydict = SqliteDict('./my_db.sqlite', autocommit=True)
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


######################################
if __name__ == '__main__':
    # TESTING:
    TVL = TempValLocal()
    TVL.roomT = 21.8
    print(TVL.roomT)
    for key, value in TVL.mydict.iteritems():
        print (key, value)



