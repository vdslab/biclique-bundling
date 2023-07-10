import csv
import json
#https://www.kaggle.com/retailrocket/ecommerce-dataset
#transactionはエッジが疎なデータ 20000ぐらい
#addtocartsはtransactionsより3倍ぐらい濃そう 69332
#viewは結構エッジが濃い　2664312
#上からn個とり出すとだけだと疎になる

#あるvisitorに集中する方向
#csvファイルをtimestampではなくvisitorでソートした方がよい

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

def extract_add_cart():
    add_cnt = 0
    addtocarts = []

    with open('public/retailrocket/events.csv', encoding='utf-8', newline='') as f:
        for cols in csv.reader(f):
            if(cols[2] == 'addtocart'):
                add_cnt += 1
                addtocarts.append({'visitorid':cols[1], 'itemid':cols[3]})
        f.close()
    print(add_cnt)

    with open('public/retailrocket/addtocarts.csv', 'w',encoding='utf-8') as f:
        writer = csv.DictWriter(f, ['visitorid', 'itemid'])
        writer.writeheader()
        for row in addtocarts:
            writer.writerow(row)
        f.close()
    print("finish")

def extract_views():
    view_cnt = 0
    views = []

    with open('public/retailrocket/events.csv', encoding='utf-8', newline='') as f:
        for cols in csv.reader(f):
            if(cols[2] == 'view'):
                view_cnt += 1
                views.append({'visitorid':cols[1], 'itemid':cols[3]})
        f.close()
    print(view_cnt)

    with open('public/retailrocket/views.csv', 'w',encoding='utf-8') as f:
        writer = csv.DictWriter(f, ['visitorid', 'itemid'])
        writer.writeheader()
        for row in views:
            writer.writerow(row)
        f.close()
    print("finish")


def make_transaction_bipartite():
    return

visit = []
item = []
cnt = 0
print("edge_num >> ")
edge_num = int(input())
with open('public/retailrocket/views.csv', encoding='utf-8', newline='') as f:

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
visit_c = list(map(lambda v: visit_dict[v], visit))
item_c = list(map(lambda v: item_dict[v], item))

print(visit_c)
print(item_c)
#print(len(set(visit)))
#print(len(set(item)))
#print(cnt)

matrix = [[0] * ( max(item_c) + 1 ) for i in range(max(visit_c) + 1 )]
print("left", len(matrix))
print("right", len(matrix[0]))
#print(matrix)

for i, j in zip(visit_c,item_c):
    matrix[i][j] = 1

#print(matrix)
#print(matrix)
with open('public/retailrocket/json/views_edgenum_{}.json'.format(edge_num),'w' ,encoding='utf-8') as f:
    json.dump(matrix, f)
