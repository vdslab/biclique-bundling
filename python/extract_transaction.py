import csv
import json
#https://www.kaggle.com/retailrocket/ecommerce-dataset

trans_cnt = 0
transactions = []

with open('public/retailrocket/events.csv', encoding='utf-8', newline='') as f:
    for cols in csv.reader(f):
        if(cols[2] == 'transaction'):
            trans_cnt += 1
            transactions.append({'visitorid':cols[1], 'itemid':cols[3]})
    f.close()
print(trans_cnt)

with open('public/retailrocket/transactions.csv', 'w',encoding='utf-8') as f:
    writer = csv.DictWriter(f, ['visitorid', 'itemid'])
    writer.writeheader()
    for row in transactions:
        writer.writerow(row)
    f.close()
print("finish")
