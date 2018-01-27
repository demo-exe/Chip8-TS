import sys

if sys.version_info[0] < 3:
    raise Exception("This script was written for python 3")

if len(sys.argv) < 2:
    print ("Usage: python3 jsencode.py FILENAME")

with open(sys.argv[1], "rb") as f:
    rawdata = f.read()


memptr = 512
out = ''
for x in rawdata:
    out    += "mem.setMem(%s, %s);\n" % (hex(memptr), hex(x))
    memptr += 1

print(out)