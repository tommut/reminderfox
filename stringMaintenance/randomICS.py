#!/usr/bin/env python
# -*- coding: utf-8 -*-

''' 
    Randomize ICS data file         /2018-05-24_12/  ¢gNeandr

    Support/Debug script
    For debugging purpose the structure and attributes of ICS data is required.
    To protect private content of ICS data certain strings are randomize.

    These strings/lines are
    -- SUMMARY: 
    -- DESCRIPTION:
    -- URL:
    -- ORGANIZER:
    -- ATTENDEE:

    Call:   ./randomICS.py {fileName}
               fileName is optional, if not given assumes 'reminder.ics'
               in the same directory
    Result:  The resulting ICS data file is stored to 'random.ics'

    Installation:    
          -- Store 'randomICS.py to a working directory
          -- make the it executable with
               $ chmod 755 randomICS.py

'''


import sys           # , traceback, json, os, platform
import random
import string



def randomStr(Len):
    return ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(Len)])


def main(fName):

    newLines = ""
    strFile = open(fName, 'r')
    icsLines = strFile.readlines()
    strFile.close()

    folding = False

    for Line in icsLines:
        if folding == True and Line[0:1] == ' ':
            l = len(Line) -2
            Line = ' ' + randomStr(l) +'\n'
        elif Line[0:8] == 'SUMMARY:':
            l = len(Line) - 9
            Line = 'SUMMARY:' + randomStr(l) +'\n'
            folding = True

        elif Line[0:12] == 'DESCRIPTION:':
            l = len(Line) - 13
            Line = 'DESCRIPTION:' + randomStr(l) +'\n'
            folding = True

        elif Line[0:4] == 'URL:':
            l = len(Line) - 5
            Line = 'URL:' + randomStr(l) +'\n'
            folding = True

        elif Line[0:10] == 'ORGANIZER:':
            l = len(Line) - 11
            Line = 'ORGANIZER:' + randomStr(l) +'\n'
            folding = True

        elif Line[0:9] == 'ATTENDEE:':
            l = len(Line) - 10
            Line = 'ATTENDEE:' + randomStr(l) +'\n'
            folding = True

        else:
            folding = False

        newLines = newLines  + (Line)

    return newLines

#-------------------------------------------
if __name__ == '__main__':
    if (len(sys.argv) == 2):
        fName = str(sys.argv[1])
        print 'Reading file: ' + fName
    else:
        fName = 'reminder.ics'

    data = ""
    data =  main(fName)

    fileName = 'random.ics'
    f = open(fileName, 'w')
    f.write(data)
    f.close()

    print data
    