import csv
import json
# https://snap.stanford.edu/data/act-mooc.html
start = 1

print("edge_num >> ")
end = int(input())
end += 1

mooc_data = []
with open('public/act-mooc/mooc_actions.tsv', encoding='utf-8', newline='') as f:

    for cols in csv.reader(f, delimiter='\t'):
        mooc_data.append(cols)
    f.close()

userId_list = []
targetId_list = []

for i in range(start, end):
    userId = int(mooc_data[i][1])
    targetId = int(mooc_data[i][2])

    userId_list.append(userId)
    targetId_list.append(targetId)
    print(userId, targetId)

maxuserId = max(userId_list)
minuserId = min(userId_list)

maxtargetId = max(targetId_list)
mintargetId = min(targetId_list)

print("================================")
print(maxuserId, minuserId)
print(maxtargetId, mintargetId)

matrix = [[0] * (maxtargetId - mintargetId + 1) for i in range(maxuserId - minuserId + 1)]

for user, target in zip(userId_list, targetId_list):
    matrix[user][target] = 1
cnt = 0
for i in matrix:
    for j in i:
        if(j==1):
            cnt += 1

print(cnt)
print(len(userId_list))
print("#####################")
print("left:", len(matrix))
print("right:", len(matrix[0]))


with open('public/act-mooc/json/mooc_actions_{}.json'.format(end-1), 'w') as f:
    json.dump(matrix, f)



