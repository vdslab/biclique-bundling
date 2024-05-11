#jsonのフォーマット
#random_{left_num}_{right_num}_{probability}_{instance}.json
import sys
import random

sizes = [7, 10, 15]
probs = [70, 80, 90]
instances = 5

# 42341
random.seed(42341)

for ins in range(instances):
    for size in sizes:
        for prob in probs:
            output = []
            for i in range(size):
                vec = []
                for j in range(size):
                    if(100*random.random() < prob):
                        vec.append(1)
                    else:
                        vec.append(0)
                output.append(vec)
            output_file = "public/random-exp/output_json/random_{}_{}_{}_{}.json".format(size, size, prob, str(ins + 1).zfill(2))

            with open(output_file, "w") as file:
                sys.stdout = file
                print(output)
