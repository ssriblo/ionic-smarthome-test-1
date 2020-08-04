

# Firestore using:
import os    

#  Based on example/client-example.py
import sys
sys.path.insert(0, "..")
import logging
import time

try:
    from IPython import embed
except ImportError:
    import code

    def embed():
        vars = globals()
        vars.update(locals())
        shell = code.InteractiveConsole(vars)
        shell.interact()


from opcua import Client
from opcua import ua
from temperatures_firestore import TempVal

TV = TempVal()

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
    for childId in node.get_children():
        ch = client.get_node(childId)
        print("NODE is:", ch.get_node_class(), ch.get_browse_name(), ch.get_path())
        if ch.get_node_class() == ua.NodeClass.Object:
            browse_recursive(ch)
        elif ch.get_node_class() == ua.NodeClass.Variable:
            try:
                print("{bn} has value {val}".format(
                    bn=ch.get_browse_name(),
                    val=str(ch.get_value()))
                )
            except ua.uaerrors._auto.BadWaitingForInitialData:
                pass
################################################################################################

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARN)
    #logger = logging.getLogger("KeepAlive")
    #logger.setLevel(logging.DEBUG)

#    client = Client("opc.tcp://localhost:4840/freeopcua/server/")
    # client = Client("opc.tcp://admin@localhost:4840/freeopcua/server/") #connect using a user
    # GWSerebrum local test:
    client = Client("opc.tcp://ua_client:ua_password@192.168.1.36:16664")
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
        print(idx)

        # Now getting a variable node using its browse path
#        myvar = root.get_child(["0:Objects", "{}:MyObject".format(idx), "{}:MyVariable".format(idx)])
#        obj = root.get_child(["0:Objects", "{}:MyObject".format(idx)])
#        print("myvar is: ", myvar)

#YA1002d00213437471231373739
        print(root.get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[0].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[1].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[2].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[3].get_browse_name())
        print("myvar is: ", root.get_children()[0].get_children()[2].get_children()[0].get_children()[3].get_value())
        while True:
            airT = root.get_children()[0].get_children()[2].get_children()[0].get_children()[3].get_value()
            print("airT is:", airT)
            TV.targetT = airT
            time.sleep(3)
#        QualifiedName(0:Root)
#        myvar is:  QualifiedName(0:YA1002d00213437471231373739:vars:f1)
#        myvar is:  QualifiedName(0:YA1002d00213437471231373739:vars:Счетчики)
#        myvar is:  QualifiedName(0:YA1002d00213437471231373739:vars:f2)
#        myvar is:  QualifiedName(0:YA1002d00213437471231373739:vars:temperature)
#        myvar is:  20.225364685058594

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

      
#        browse_recursive(root)
#       QualifiedName(0:YA1002d00213437471231373739:vars:temperature) has value 20.225364685058594

        


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

#        embed()
    finally:
        client.disconnect()
