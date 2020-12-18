import numpy as np
import sys
import json

class DataParserTT(object):
    def __init__(self):
        pass
        # Let convert from string to json:    
        #    

    def timetableParser(self, str):
#        ob = self.obj
        a = [None]*16
        print(f"\n\nstr type", type(str), str) # магическим образом этот принт нужен - без него type(str)=dict и все падает
        ob = json.loads(str)
#        print(f"OBJECT", ob, ob['mode'])
        try:
            if (ob['mode'] == "TimeTable"):
                a[0] = 1
            else:
                a[0] = 0
            a[1] = ob['comf_0']
            a[2] = ob['comf_1']
            a[3] = ob['econ_0']
            a[4] = ob['econ_1']
            a[5] = 0 # Reserved
            a[6] = 0 # Reserved
            a[7] = ob['tt_vals'][0]['start']
            a[8] = ob['tt_vals'][0]['end']
            a[9] = ob['tt_vals'][1]['start']
            a[10] = ob['tt_vals'][1]['end']
            a[11] = ob['tt_vals'][2]['start']
            a[12] = ob['tt_vals'][2]['end']
            for i in range(0,3):
                array = []
                for j in range(0,6):
                    array.append(ob['tt_days'][i][j])
                    nda = np.packbits(array, bitorder='little')
                a[i+13] = int(nda[0])
        except:
            e = sys.exc_info()
            print( "EXCEPTION3: ", e[0], e[1])
        return a

