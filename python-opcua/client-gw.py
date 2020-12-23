import os    
import socket

#  Based on example/client-example.py
import sys
sys.path.insert(0, "..")
import logging
import time

from opcua import Client
from opcua import ua
from temperatures_local_db import TempValLocal
from data_parser import DataParserF8, DataParserB2
from timetable_parser import DataParserTT



TV = TempValLocal()
ch_F8 = None
ch_B2 = None
ch_targetT = None
ch_weatherT = None
ch_timetable = None

class SubHandler(object):
    
    """
    Subscription Handler. To receive events from server for a subscription
    data_change and event methods are called directly from receiving thread.
    Do not do expensive, slow or network operation there. Create another 
    thread if you need to do such a thing
    """

    def datachange_notification(self, node, val, data):
        print("Python: New data change event", node, val)

    def event_notification(self, event):
        print("Python: New event", event)

############### from https://github.com/FreeOpcUa/python-opcua/issues/863 #########################
def browse_recursive(node):
    global ch_F8
    global ch_B2
    global ch_targetT
    global ch_weatherT
    global ch_timetable

    for childId in node.get_children():
        # NOTE: both lines below works the same! So ch=childID the same as get_node(childID)
        ch = client.get_node(childId)
#        ch = childId

#        print("NODE class is:", childId, ch.get_node_class())
#        print("NODE name is:",  ch.get_browse_name())
#        print("NODE path is:",  ch.get_path() )
        if ch.get_node_class() == ua.NodeClass.Object:
            browse_recursive(ch)
        elif ch.get_node_class() == ua.NodeClass.Variable:
            try:
#                print("NODE class is:", ch.get_node_class())
#                print("NODE name is:",  ch.get_browse_name())
#                print("NODE path is:",  ch.get_path() )
#                print("{bn} has value {val}".format(
#                    bn=ch.get_browse_name(),
#                    val=str(ch.get_value()))
#                )
                string = str(ch.get_browse_name())
                if string.find("Array_F") >= 0 :
                    print("Found  Array_F8", string, ch)
                    ch_F8 = ch
                if string.find("Array_B") >= 0 :
                    print("Found Array_B2", string, ch)
                    ch_B2 = ch
                if string.find("TargetT") >= 0 :
                    print("Found TargetT", string, ch)
                    ch_targetT = ch
                if string.find("WeatherT") >= 0 :
                    print("Found WeatherT", string, ch)
                    ch_weatherT = ch
                if string.find("TimeTable") >= 0 :
                    print("Found TimeTableArray", string, ch)
                    ch_timetable = ch

#            except ua.uaerrors._auto.BadWaitingForInitialData:
            except:
                e = sys.exc_info()
                print( "EXCEPTION: ", e[0], e[1])
                cntr = cntr + 1
    
################################################################################################

if __name__ == "__main__":
#    logging.basicConfig(level=logging.WARN)
    logging.basicConfig(filename='./client-gw.log', filemode='a', format='%(levelname)s - %(asctime)s - %(message)s', level=logging.WARN)

    #logger = logging.getLogger("KeepAlive")
    #logging.setLevel(logging.DEBUG)

    print ('Number of arguments:', len(sys.argv), 'arguments.')
    print ('Argument List:', str(sys.argv))
    if(len(sys.argv) == 1 ):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        url_ip = s.getsockname()[0]
        print("local IP found:", url_ip)
        s.close()
    else:
        url_ip = sys.argv[1]

    url = "opc.tcp://ua_client:ua_password@AAAA:16664"
    url = url.replace("AAAA", url_ip)
    print("url:", url)
    logging.warning(f'URL: {url}')

#    client = Client("opc.tcp://localhost:4840/freeopcua/server/")
    # client = Client("opc.tcp://admin@localhost:4840/freeopcua/server/") #connect using a user
    # GWSerebrum local test:
#    client = Client("opc.tcp://ua_client:ua_password@192.168.1.38:16664")
    client = Client(url)
    try:
        client.connect()
        client.load_type_definitions()  # load definition of server specific structures/extension objects

        # Client has a few methods to get proxy to UA nodes that should always be in address space such as Root or Objects
        root = client.get_root_node()
        print("Root node is: ", root)
        objects = client.get_objects_node()
        print("Objects node is: ", objects)

        # Node objects have methods to read and write node attributes as well as browse or populate address space
        print("Children of root are: ", root.get_children())

        # get a specific node knowing its node id
        #var = client.get_node(ua.NodeId(1002, 2))
        #var = client.get_node("ns=3;i=2002")
        #print(var)
        #var.get_data_value() # get value of node as a DataValue object
        #var.get_value() # get value of node as a python builtin
        #var.set_value(ua.Variant([23], ua.VariantType.Int64)) #set node value using explicit data type
        #var.set_value(3.9) # set node value using implicit data type

        # gettting our namespace idx
#        uri = "http://examples.freeopcua.github.io"
#        idx = client.get_namespace_index(uri)
        ns_available = client.get_namespace_array()
        print(">> ns_available", ns_available)
# >> ns_available ['http://opcfoundation.org/UA/', 'urn:telemetry:gateway']
        uri = "urn:telemetry:gateway"
        idx = client.get_namespace_index(uri)
        print("uri=", idx)
        
        browse_recursive(root)
        DF8 = DataParserF8(ch_F8)
        DB2 = DataParserB2(ch_B2)
        DTT = DataParserTT()
#        print("FOUND:", ch_targetT, ch_F8,ch_B2, ch_targetT, ch_weatherT, DF8, DB2)
        while True:
            try:              
                TV.roomT = DF8.roomT
                TV.waterT = DF8.waterT
                TV.electroMeterT1 = DF8.electroMeterT1
                TV.electroMeterT2 = DF8.electroMeterT2
                TV.waterColdMeter = DF8.waterColdMeter/1000
                TV.waterHotMeter = DF8.waterHotMeter/1000
                TV.warmMeter = DF8.warmMeter
            except:
                e = sys.exc_info()
                print( "EXCEPTION1: ", e[0], e[1])
                logging.error(f'EXCEPTION1 e[0]={e[0]}  e[1]={e[1]}')

            try:
                datavalue = ua.DataValue(ua.Variant(float(TV.weatherT), ua.VariantType.Float)) 
                ch_weatherT.set_value(datavalue)
            except:
                e = sys.exc_info()
                print( "EXCEPTION2: ", e[0], e[1])
                logging.error(f'EXCEPTION2 e[0]={e[0]}  e[1]={e[1]}')

            try:
                datavalue = ua.DataValue(ua.Variant(float(TV.targetT), ua.VariantType.Float)) 
                ch_targetT.set_value(datavalue)
            except:
                e = sys.exc_info()
                print( "EXCEPTION3: ", e[0], e[1])
                logging.error(f'EXCEPTION3 e[0]={e[0]}  e[1]={e[1]}')
            
            try:
                print(f"roomT={TV.roomT:4.2f}; waterT={TV.waterT:4.2f}; weatherT={float(TV.weatherT):4.2f}; ", end='')
                print(f"electroMeterT1={TV.electroMeterT1:6.2f}; electroMeterT2={TV.electroMeterT2:6.2f};  ", end='')
                print(f"waterColdMeter={TV.waterColdMeter:6.2f}; waterHotMeter={TV.waterHotMeter:6.2f}  ", end='')
                print(f"warmMeter={TV.warmMeter:2.0f}; TargetT={TV.targetT:4.2f}  ", end='')
                TV.flags1 = DB2.flags1
                TV.flags2 = DB2.flags2
                print(f"FLAGs1={TV.flags1}; FLAGs2={TV.flags2}")
                logging.warning(f'roomT={TV.roomT:4.2f};  TargetT={TV.targetT:4.2f}')

            except:
                e = sys.exc_info()
                print( "EXCEPTION4: ", e[0], e[1])
                logging.error(f'EXCEPTION4 e[0]={e[0]}  e[1]={e[1]}')

            try:
                array16 = DTT.timetableParser(TV.timetable)
                datavalue = ua.DataValue(ua.Variant(array16, ua.VariantType.Byte)) 
                print(f"datavalue=", datavalue)
                ch_timetable.set_value(datavalue)
                logging.warning(f'OPCUA_datavalue={datavalue}')
            except:
                e = sys.exc_info()
                print( "EXCEPTION5: ", e[0], e[1])
                logging.error(f'EXCEPTION5 e[0]={e[0]}  e[1]={e[1]}')
            time.sleep(10)

#NODE is: NodeClass.Object QualifiedName(0:YA1002d00213437471231373739) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739))]
#NODE is: NodeClass.Object QualifiedName(0:YA1002d00213437471231373739:Otoplenok) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok))]
#NODE is: NodeClass.Object QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl))]
#NODE is: NodeClass.Variable QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl:RoomT) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl:RoomT))]
#QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl:RoomT) has value 25.00678253173828
#NODE is: NodeClass.Variable QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl:WaterT) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl:WaterT))]
#QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl:WaterT) has value 50.02370834350586
#NODE is: NodeClass.Variable QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl:TargetT) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:TemperaturesControl:TargetT))]
#QualifiedName(0:YA1002d00213437471231373739:Otoplenok:TemperaturesControl:TargetT) has value 0.0
#NODE is: NodeClass.Object QualifiedName(0:YA1002d00213437471231373739:Otoplenok:Alarms) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:Alarms))]
#NODE is: NodeClass.Variable QualifiedName(0:YA1002d00213437471231373739:Otoplenok:Alarms:Alarm1) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:Alarms)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:Alarms:Alarm1))]
#QualifiedName(0:YA1002d00213437471231373739:Otoplenok:Alarms:Alarm1) has value True
#NODE is: NodeClass.Object QualifiedName(0:YA1002d00213437471231373739:Otoplenok:Counters) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:Counters))]
#NODE is: NodeClass.Variable QualifiedName(0:YA1002d00213437471231373739:Otoplenok:Counters:Counter1) [Node(TwoByteNodeId(i=84)), Node(TwoByteNodeId(i=85)), Node(StringNodeId(s=YA1002d00213437471231373739)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:Counters)), Node(StringNodeId(s=YA1002d00213437471231373739:Otoplenok:Counters:Counter1))]
#QualifiedName(0:YA1002d00213437471231373739:Otoplenok:Counters:Counter1) has value 1

        # Now getting a variable node using its browse path
#        myvar = root.get_child(["0:Objects", "{}:MyObject".format(idx), "{}:MyVariable".format(idx)])
#        obj = root.get_child(["0:Objects", "{}:MyObject".format(idx)])
#        print("myvar is: ", myvar)

#YA1002d00213437471231373739
        print(root.get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[0].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[1].get_children()[0].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[2].get_children()[0].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[0].get_children()[0].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[0].get_children()[1].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[0].get_children()[2].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[1].get_children()[0].get_children()[0].get_children()[2].get_display_name().Text)
        node =              root.get_children()[0].get_children()[1].get_children()[0]
        node_temperature =      node.get_children()[0]
        node_alarm =            node.get_children()[1]
        node_serversStatus =    node.get_children()[1] # used before, but then dropped
        node_counter =          node.get_children()[2]

        targetT =       node_temperature.get_children()[2]
        roomT =         node_temperature.get_children()[1]
        waterT =        node_temperature.get_children()[0]
        counter =       node_counter.get_children()[0]
        alarm =         node_alarm.get_children()[0]

        print(
            targetT.get_display_name().Text, 
            roomT.get_display_name().Text, 
            waterT.get_display_name().Text, 
            counter.get_display_name().Text,
            alarm.get_display_name().Text, 
            )

        while True:
            TV.roomT = roomT.get_value()
            TV.waterT = waterT.get_value()
            datavalue = ua.DataValue(ua.Variant(TV.targetT, ua.VariantType.Float)) 
            targetT.set_value(datavalue)
            print("roomT", roomT.get_value(), "waterT", waterT.get_value(), "tartetT", targetT.get_value())
            logging.warning(f'roomT={roomT.get_value()} waterT={waterT.get_value()} tartetT={targetT.get_value()}')
            time.sleep(10)

        while True:
            print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[0].get_children()[0].get_value())
            print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[0].get_children()[1].get_value())
            print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[0].get_children()[2].get_value())
            print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[1].get_children()[0].get_value())
            print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[2].get_children()[0].get_value())
            time.sleep(2)
        """
        t1 = client.get_node("ns=0;i=85")
        print(t1, t1.get_children())
        v = client.get_node("ns=0;i=85")
        node_plc = v.get_child("YA1002d00213437471231373739")
        print(v, node_plc, node_plc.get_children())
        vars = node_plc.get_children()
        print(vars, type(vars), len(vars))
        print(*vars, sep='\n')
        v0 = vars[0]
        print(v0, type(v0), v0.get_children())
        print(v0, type(v0.get_children()) )
        par_list = v0.get_children()
        par0 = par_list
        print(">>27",par0, type(par0), par0[3], type(par0[3]))
        tobj = par0[3]
        print(">>28",tobj, tobj.get_data_value(), tobj.get_value())
        print(tobj.get_browse_name())
        print(tobj.get_data_type())
        print(tobj.get_description())
        print(tobj.get_description_refs())
        print(tobj.get_display_name())
        print(tobj.get_parent())
        print(tobj.get_path())
        print(tobj.get_properties())
        print(tobj.get_type_definition())
        print(tobj.get_variables())
        """       
        # subscribing to a variable node
#        handler = SubHandler()
#        sub = client.create_subscription(500, handler)
#        handle = sub.subscribe_data_change(myvar)
#        time.sleep(0.1)

        # we can also subscribe to events from server
#        sub.subscribe_events()
        # sub.unsubscribe(handle)
        # sub.delete()

        # calling a method on server
#        res = obj.call_method("{}:multiply".format(idx), 3, "klk")
#        print("method result is: ", res)
    finally:
        client.disconnect()