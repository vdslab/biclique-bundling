import csv
import json
#https://www.kaggle.com/retailrocket/ecommerce-dataset

def extract_translations():
    trans_cnt = 0
    transactions = []

    with open('public/retailrocket/events.csv', encoding='utf-8', newline='') as f:
        for cols in csv.reader(f):
            if(cols[2] == 'transaction'):
                trans_cnt += 1
                transactions.append({'visitorid':cols[1], 'itemid':cols[3], 'transactionid':cols[4]})
        f.close()
    print(trans_cnt)

    with open('public/retailrocket/transactions.csv', 'w',encoding='utf-8') as f:
        writer = csv.DictWriter(f, ['visitorid', 'itemid','transactionid'])
        writer.writeheader()
        for row in transactions:
            writer.writerow(row)
        f.close()
    print("finish")

def make_transaction_bipartite():
    return

visit = []
item = []
cnt = 0
edge_num = 100
with open('public/retailrocket/transactions.csv', encoding='utf-8', newline='') as f:

    cnt = 0
    for cols in csv.reader(f):
        cnt += 1
        if(cnt == 1):
            continue
        visit.append(cols[0])
        item.append(cols[1])

        if(edge_num < cnt):
            break
    f.close()


visit_sorted = sorted(set(visit))
item_sorted = sorted(set(item))

visit_dict = { v: i for i, v in enumerate(visit_sorted) }
item_dict = { v: i for i, v in enumerate(item_sorted)}

print(visit)
print(item)

#print(list(map(lambda v: visit_dict[v], visit)))
#print(list(map(lambda v: item_dict[v], item)))

#print(len(set(visit)))
#print(len(set(item)))
#print(cnt)

matrix = [[0] * (len(set(visit))) for i in range(len(set(item)))]
print("left", len(matrix))
print("right", len(matrix[0]))
#print(matrix)
#with open('public/retailrocket/transactions_edge_{}.csv'.format(edge_num-1),'w' ,encoding='utf-8') as f:
#    json.dump(matrix, f)
