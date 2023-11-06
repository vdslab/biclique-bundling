#jsonのフォーマット
#random_{left_num}_{right_num}_{probability}_{}.json
import sys
import random

left_num = int(input())
right_num = int(input())
probability = int(input())
file_num = int(input())

for version in range(file_num):
    output = []

    for i in range(left_num):
        vec = []
        for j in range(right_num):
            num = 10 * random.random()
            if(100*random.random() < probability +  (-1 + num % 3 if num % 3 != 0 else 2)*(num % 3)*10):
                vec.append(1)
            else:
                vec.append(0)
        output.append(vec)

    output_file = "public/random/json/random_{}_{}_{}_{}.json".format(left_num, right_num, probability, version+1)

    with open(output_file, "w") as file:
        sys.stdout = file  # 標準出力をファイルに変更します
        print(output)
