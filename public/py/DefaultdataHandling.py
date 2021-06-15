import csv
import json

input = open('./uploads/Defaultdata.csv')
inputcsv = csv.reader(input)

inputDate = []
inputSentiment = []
valueSentiment = []

inputSendUser = []
inputSendJob = []

inputReceiveUser = []
inputReceiveJob = []

bigListSend = []
bigListReceive = []
userList = []

bigLinkList = []
linkList = []
linkListCount = []

jsonString = ""

for row in inputcsv:
    if row[2] != 'fromEmail':
        inputSendUser.append(row[2])
    if row[3] != 'fromJobtitle':
        inputSendJob.append(row[3])
    if row[5] != 'toEmail':
        inputReceiveUser.append(row[5])
    if row[6] != 'toJobtitle':
        inputReceiveJob.append(row[6])
    if row[0] != 'date':
        inputDate.append(row[0])
    if row[8] != "sentiment":
        inputSentiment.append(float(row[8]))

for x in inputSentiment:
    if x==0:
        valueSentiment.append("NEUTRAL")
    elif x<0:
        valueSentiment.append("NEGATIVE")
    elif x>0:
        valueSentiment.append("POSITIVE")

for x in range(len(inputSendUser)):
    bigListSend.append([inputSendUser[x], inputSendJob[x]])

for x in bigListSend:
    if x not in userList:
        userList.append(x)

for x in range(len(inputReceiveUser)):
    bigListReceive.append([inputReceiveUser[x], inputReceiveJob[x]])

for x in bigListReceive:
    if x not in userList:
        userList.append(x)

allUsersList, allJobsList = map(list, zip(*userList))

for x in range(len(inputSendUser)):
    linkList.append([inputSendUser[x], inputReceiveUser[x], valueSentiment[x], inputDate[x]])

sourceUserList, targetUserList, sentimentSentList, dateSentList = map(list, zip(*linkList))

for x in range(len(dateSentList)):
    dateSentList[x] = dateSentList[x].replace("-", "/")

text_file = open("./public/data/GraphInput.json", "w")

text_file.write(jsonString + '{\n  "nodes":\n \n[\n')

for x in range(len(allUsersList) - 1):
    text_file.write(' {\n   "id": "' + allUsersList[x] +\
         '",\n   "group": "' + allJobsList[x] + '"\n }, \n')

text_file.write(' {\n   "id": "' + allUsersList[len(allUsersList) - 1] +\
     '",\n   "group": "' + allJobsList[len(allUsersList) - 1] + '"\n } \n], \n \n \n')

text_file.write('  "links": [\n')

for x in range(len(linkList) - 1):
    text_file.write(' {\n   "source": "' + sourceUserList[x] + '",\n   "target": "' +\
         targetUserList[x] + '",\n   "source_group": "' + inputSendJob[x] + '",\n   "target_group": "' + inputReceiveJob[x] +\
              '.",\n   "sentiment": "' + sentimentSentList[x] + '",\n   "date": "' + dateSentList[x] + '"\n}, \n')

text_file.write(' {\n   "source": "' + sourceUserList[len(sourceUserList) -1] + '",\n   "target": "' +\
     targetUserList[len(sourceUserList) -1] +  '",\n   "source_group": "' + inputSendJob[len(sourceUserList) -1] +\
          '",\n   "target_group": "' + inputReceiveJob[len(sourceUserList) -1] + '.",\n   "sentiment": "' + sentimentSentList[len(sourceUserList) - 1] +\
               '",\n   "date": "' + dateSentList[len(sourceUserList) -1] + '"\n }\n]\n}')

text_file.close()