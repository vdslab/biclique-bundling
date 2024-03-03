#jsonのフォーマット
#random_{left_num}_{right_num}_{probability}_{instance}.json
import sys
import random
import os

lefts = [15, 20, 25, 30]
rights = [15, 20, 25, 30]
probs = [70, 80, 90]
instances = 30

# 95
random.seed(95)

for ins in range(instances):
    for left in lefts:
        for right in rights:
            if(right < left):
                continue
            if(right - left > 5):
                continue

            for prob in probs:
                output = []

                for i in range(left):
                    vec = []
                    for j in range(right):
                        if(100*random.random() < prob):
                            vec.append(1)
                        else:
                            vec.append(0)
                    output.append(vec)

                os.makedirs("public/random-exp/json/{}_{}/{}/".format(left, right, prob), exist_ok=True)
                output_file = "public/random-exp/json/{}_{}/{}/random_{}.json".format(left, right, prob, str(ins + 1).zfill(2))

                with open(output_file, "w") as file:
                    sys.stdout = file  # 標準出力をファイルに変更します
                    print(output)
