

class DataParserF8(object):
    def __init__(self, ch):
        self.ch = ch
######################################
    @property
    def targetT(self):
        return self.ch.get_value()[3]

    @targetT.setter
    def targetT(self, val):
        self.ch.set_value[3] = val
######################################    
    @property
    def roomT(self):
        return self.ch.get_value()[1]

    @roomT.setter
    def roomT(self, val):
        self.ch.set_value[1] = val
######################################
    @property
    def waterT(self):
        return self.ch.get_value()[2]

    @waterT.setter
    def waterT(self, val):
        self.ch.set_value[2] = val
######################################

class DataParserB2(object):
    def __init__(self, ch):
        self.ch = ch
######################################
    @property
    def byte0(self):
        return self.ch.get_value()[0]

    @byte0.setter
    def byte0(self, val):
        self.ch.set_value[0] = val
######################################    
    @property
    def byte1(self):
        return self.ch.get_value()[1]

    @byte1.setter
    def byte1(self, val):
        self.ch.set_value[1] = val
######################################    
