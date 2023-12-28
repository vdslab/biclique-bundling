#jsonのフォーマット
#random_{left_num}_{right_num}_{probability}_{}.json
import sys
import random

left_nums = [10, 15, 20]
right_nums = [10, 15, 20]
probabilities = [70, 80, 90]

for left_num in left_nums:
    for right_num in right_nums:
        if(right_num < left_num):
            continue

        if(right_num - left_num > 5):
            continue

        for probability in probabilities:
            output = []

            for i in range(left_num):
                vec = []
                for j in range(right_num):
                    if(100*random.random() < probability):
                        vec.append(1)
                    else:
                        vec.append(0)
                output.append(vec)

            output_file = "public/random-ex/json/random_{}_{}_{}.json".format(left_num, right_num, probability)

            with open(output_file, "w") as file:
                sys.stdout = file  # 標準出力をファイルに変更します
                print(output)
