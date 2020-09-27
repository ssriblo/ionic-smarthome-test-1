#!/bin/bash 
echo
echo '>>>>>>>>>>>>>>>>>> OPC UA Client Start now >>>>>>>>>>>>>>>'
echo
cd ~/Work/ionic-smarthome-test-1/python-opcua/
source env/bin/activate
python3 client-gw.py 193.124.56.188
