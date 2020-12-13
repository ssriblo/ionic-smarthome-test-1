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
        if 'serversStatus' not in self.mydict: 
            self.mydict['serversStatus'] = 0
        if 'electroMeterT1' not in self.mydict: 
            self.mydict['electroMeterT1'] = 0
        if 'electroMeterT2' not in self.mydict: 
            self.mydict['electroMeterT2'] = 0
        if 'warmMeter' not in self.mydict: 
            self.mydict['warmMeter'] = 0
        if 'waterColdMeter' not in self.mydict: 
            self.mydict['waterColdMeter'] = 0
        if 'waterHotMeter' not in self.mydict: 
            self.mydict['waterHotMeter'] = 0
        if 'weatherT' not in self.mydict: 
            self.mydict['weatherT'] = 1
        if 'flags1' not in self.mydict: 
            self.mydict['flags1'] = 0
        if 'flags2' not in self.mydict: 
            self.mydict['flags2'] = 0
        if 'timetable' not in self.mydict: 
            self.mydict['timetable'] = {}
######################################
    @property
    def timetable(self):
        return self.mydict['timetable']

    @timetable.setter
    def timetable(self, val):
        self.mydict['timetable'] = val
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
    def electroMeterT1(self):
        return self.mydict['electroMeterT1']

    @electroMeterT1.setter
    def electroMeterT1(self, val):
        self.mydict['electroMeterT1'] = val
######################################
    @property
    def electroMeterT2(self):
        return self.mydict['electroMeterT2']

    @electroMeterT2.setter
    def electroMeterT2(self, val):
        self.mydict['electroMeterT2'] = val
######################################
    @property
    def warmMeter(self):
        return self.mydict['warmMeter']

    @warmMeter.setter
    def warmMeter(self, val):
        self.mydict['warmMeter'] = val
######################################
    @property
    def waterColdMeter(self):
        return self.mydict['waterColdMeter']

    @waterColdMeter.setter
    def waterColdMeter(self, val):
        self.mydict['waterColdMeter'] = val
######################################
    @property
    def waterHotMeter(self):
        return self.mydict['waterHotMeter']

    @waterHotMeter.setter
    def waterHotMeter(self, val):
        self.mydict['waterHotMeter'] = val
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



