

class DataParserF8(object):
    def __init__(self, ch):
        self.ch = ch
######################################
    @property
    def roomT(self):
        return self.ch.get_value()[1]
######################################
    @property
    def waterT(self):
        return self.ch.get_value()[2]
######################################
    @property
    def mercuryV1(self):
        return self.ch.get_value()[4]
######################################
    @property
    def mercuryV2(self):
        return self.ch.get_value()[5]
######################################
    @property
    def proteyW(self):
        return self.ch.get_value()[6]
######################################
    @property
    def weatherT(self):
        return self.ch.get_value()[7]
######################################
    @property
    def targetT(self):
        return self.ch.get_value()[3]
######################################


class DataParserB2(object):
    def __init__(self, ch):
        self.ch = ch
######################################
    @property
    def byte0(self):
        return self.ch.get_value()[0]
######################################    
    @property
    def byte1(self):
        return self.ch.get_value()[1]
######################################    
