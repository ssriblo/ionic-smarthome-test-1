

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
    def electroMeterT1(self):
        return self.ch.get_value()[4]
######################################
    @property
    def electroMeterT2(self):
        return self.ch.get_value()[5]
######################################
    @property
    def waterColdMeter(self):
        return self.ch.get_value()[6]
######################################
    @property
    def waterHotMeter(self):
        return self.ch.get_value()[7]
######################################
    @property
    def warmMeter(self):
        return self.ch.get_value()[3]
######################################


class DataParserB2(object):
    def __init__(self, ch):
        self.ch = ch
######################################
    @property
    def flags1(self):
        return self.ch.get_value()[0]
######################################    
    @property
    def flags2(self):
        return self.ch.get_value()[1]
######################################    
