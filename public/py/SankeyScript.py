import csv

input = open('data.csv')
inputcsv = csv.reader(input)

inputSource = []
inputTarget = []
newTarget = []
inputSentiment = []
inputDate = []
valueSentiment = []
numberStart = []

monthList = []
yearList = []

bigList = []
checkList = []
resultList = []

for row in inputcsv:
    inputDate.append(row[0])
    inputSource.append(row[3])
    inputTarget.append(row[6])
    if row[8] != "sentiment":
        inputSentiment.append(float(row[8]))

input.close()

copyTarget = inputTarget.copy()

for x in inputSentiment:
    if x==0:
        valueSentiment.append("NEUTRAL")
    elif x<0:
        valueSentiment.append("NEGATIVE")
    elif x>0:
        valueSentiment.append("POSITIVE")

for x in valueSentiment:
    inputSource.append(x)

newTarget.append("target")

for x in valueSentiment:
    newTarget.append(x)

for x in inputTarget:
    if x != "toJobtitle":
        newTarget.append(x)

numberStart.append("value")
for x in range(len(newTarget) - 1):
    numberStart.append(1)

monthList.append("month")
yearList.append("year")

for x in inputDate:
    if x != "date":
        monthList.append(int(x[5:7]))
        yearList.append(int(x[0:4]))

for x in range(len(monthList)):
    if monthList[x] != "month":
        monthList.append(monthList[x])
    if yearList[x] != "year":
        yearList.append(yearList[x])

inputSource[0] = "source"

for x in range(len(newTarget)):
    bigList.append([inputSource[x], newTarget[x], monthList[x], yearList[x], numberStart[x]])

for x in bigList:
    if x not in checkList:
        checkList.append(x)

resultList.append(['source', 'target', 'month', 'year', 'value'])

for x in range(len(checkList)):
    if x != 0:
        checkList[x][4] = bigList.count(checkList[x])
        resultList.append(checkList[x])

with open('commas.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(resultList)