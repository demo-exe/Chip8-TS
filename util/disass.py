#this program is used to "dissasemble" CHIP-8 ROM's for debugging reasons

import sys

if sys.version_info[0] < 3:
    raise Exception("This script was written for python 3")

if len(sys.argv) < 2:
    print ("Usage: python3 dissasm.py FILENAME")

with open(sys.argv[1], "rb") as f:
    rawdata = f.read()



#describing functions

def n0 (data):
    if data == 0x0E0:
        return "disp_clear();"
    if data == 0x0EE:
        return "return;"
    return "call 0x%03X; // RCA 1802 UNUSED CALL" % data

def n1 (data):
    return "goto 0x%03X;" % data

def n2 (data):
    return "call 0x%03X;" % data

def n3 (data):
    return "skip next if (V%X == 0x%02X)" % (data >> 2*4, data & 0xFF)

def n4 (data):
    return "skip next if (V%X != 0x%02X)" % (data >> 2*4, data & 0xFF)

def n5 (data):
    if (data & 0xF) != 0:
        return "UNKNOWN OPCODE (0x5%03X)" % data
    return "skip next if (V%X == V%X)" % (data >> 2*4, (data & 0xF0) >> 4)

def n6 (data):
    return "set V%X = 0x%02X;" % (data >> 2*4, data & 0xFF)

def n7 (data):
    return "set V%X = V%X + 0x%02X;" % (data >> 2*4, data >> 2*4, data & 0xFF)

def n8 (data):
    X = data >> 2*4 # XYn => (X, Y)
    Y = (data & 0xF0) >> 4
    if data & 0xF == 0:
        return "set V%X = V%X" % (X, Y)
    if data & 0xF == 1:
        return "set V%X = V%X | V%X;" % (X, X, Y)
    if data & 0xF == 2:
        return "set V%X = V%X & V%X;" % (X, X, Y)
    if data & 0xF == 3:
        return "set V%X = V%X ^ V%X;" % (X, X, Y)
    if data & 0xF == 4:
        return "set V%X = V%X + V%X; // VF is set to 1 when if carry and 0 if not" % (X, X, Y)
    if data & 0xF == 5:
        return "set V%X = V%X - V%X; // VF is set to 0 when if borrow and 1 if not" % (X, X, Y)
    if data & 0xF == 6:
        return "set V%X = V%X = V%X >> 1; // VF = LSB of old V%X" % (X, Y, Y, Y)
    if data & 0xF == 7:
        return "set V%X = V%X - V%X; // VF is set to 0 when if borrow and 1 if not" % (X, Y, X)
    if data & 0xF == 0xE:
        return "set V%X = V%X = V%X << 1; // VF = MSB of old V%X" % (X, Y, Y, Y)
    return "UNKNOWN OPCODE (0x8%03X)" % data

def n9 (data):
    if (data & 0xF) != 0:
        return "UNKNOWN OPCODE (0x9%03X)" % data
    return "skip next if (V%X != V%X)" % (data >> 2*4, (data & 0xF0) >> 4)

def nA (data):
    return "set I = 0x%03X;" % data

def nB (data):
    return "jump to V0 + 0x%03X;" % data

def nC (data):
    return "set V%X = rand() & 0x%02X" % (data >> 2*4, data & 0xFF)

def nD (data):
    return "draw(V%X,V%X,%X);" % (data >> 2*4, data & 0xFF >> 4, data & 0xF)

def nE (data):
    if (data & 0xFF) != 0x9E:
        return "skip next if (key() == V%X)" % (data >> 2*4)
    if (data & 0xFF) != 0xA1:
        return "skip next if (key() != V%X)" % (data >> 2*4)
    return "UNKNOWN OPCODE (0xE%03X)" % data

def nF (data):
    if (data & 0xFF) != 0x07:
        return "set V%X = get_delay();" % (data >> 2*4)
    if (data & 0xFF) != 0x0A:
        return "set V%X = get_key();" % (data >> 2*4)
    if (data & 0xFF) != 0x15:
        return "delay_timer(V%X);" % (data >> 2*4)
    if (data & 0xFF) != 0x18:
        return "sound_timer(V%X);" % (data >> 2*4)
    if (data & 0xFF) != 0x1E:
        return "set I = I + V%X;" % (data >> 2*4)
    if (data & 0xFF) != 0x29:
        return "set I = sprite_addr[V%X];" % (data >> 2*4)
    if (data & 0xFF) != 0x33:
        return "set *(I) = BCD(V%X,3); set *(I+1) = BCD(V%X,2); set *(I+2) = BCD(V%X,1);" % (data >> 2*4, data >> 2*4, data >> 2*4)
    if (data & 0xFF) != 0x55:
        return "reg_dump(V0 .. V%X, &I);" % (data >> 2*4)
    if (data & 0xFF) != 0x65:
        return "reg_load(V0 .. V%X, &I);" % (data >> 2*4)

    return "UNKNOWN OPCODE (0xF%03X)" % data



# first nibble recog
nibble1={ 
    0x0: n0,
    0x1: n1,
    0x2: n2,
    0x3: n3,
    0x4: n4,
    0x5: n5,
    0x6: n6,
    0x7: n7,
    0x8: n8,
    0x9: n9,
    0xA: nA,
    0xB: nB,
    0xC: nC,
    0xD: nD,
    0xE: nE,
    0xF: nF
}


out = ''
addr = 0x200
for i in range(0,len(rawdata) ,2):
    #calc opcode
    opcode = (int(rawdata[i]) << 8) + int(rawdata[i+1])

    #first nibble search
    fn = opcode >> (3*4)
    handler = nibble1[fn]
    description = handler(opcode & 0xFFF)

    #format string
    out += '0x%04X : %s\n' % (addr, description)
    addr += 2

print(out)