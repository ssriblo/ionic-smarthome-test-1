import numpy as np

class DataParserTT(object):


    def __init__(self, ch, obj):
        self.ch = ch
        self.obj = obj

    def timetableParser(self):
        ob = self.obj
        a = [None]*16
        if (ob['value'][0]['mode'] == "Timetable"):
            a[0] = 1
        else:
            a[0] = 0
        a[7] = ob['value'][1]['tt_vals'][0]['start']
        a[8] = ob['value'][1]['tt_vals'][0]['end']
        a[9] = ob['value'][1]['tt_vals'][1]['start']
        a[10] = ob['value'][1]['tt_vals'][1]['end']
        a[11] = ob['value'][1]['tt_vals'][2]['start']
        a[12] = ob['value'][1]['tt_vals'][2]['end']
        for i in range(0,3):
            array = []
            for j in range(0,6):
                array.append(ob['value'][2]['tt_days'][i][j])
                nda = np.packbits(array, bitorder='little')
            a[i+13] = nda[0]
        print(f"AAAAA", a)

              

#    datavalue = ua.DataValue(ua.Variant(float(TV.timetable), ua.VariantType.Float)) 
#    self.ch.set_value(datavalue)