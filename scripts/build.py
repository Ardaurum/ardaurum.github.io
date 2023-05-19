import os
import re
import time
import shutil

startTime = time.time()

print("=========================")
print("Generating category pages")
print("=========================")

if os.path.isdir("categories"):
    shutil.rmtree("categories")
os.mkdir("categories")

categoryFileHeader = """---
layout: category
title: {0:}
permalink: categories/{0:}/
---
"""

allCategories = set()

for root, dirs, files in os.walk("_posts"):
    for file_name in files:
        if file_name.endswith(".markdown"):
            file_path = os.path.join(root, file_name)
            print("Extracting categories for: " + file_path)

            with open(file_path, "r") as file:
                next(file)
                for line in file:
                    line = line.strip()
                    if line.startswith("categories"):
                        allCategories.update(re.search(r'\[(.*?)\]', line).group(1).replace(' ', '').split(','))
                    elif line == "---":
                        # Break in case categories don't exist in the meta block
                        break
                        
print("Extracted categories: " + ', '.join(allCategories))
for category in allCategories:
    file_path = os.path.join("categories", category + ".html")
    with open(file_path, "w") as file:
        file.write(categoryFileHeader.format(category))

elapsedTime = time.time() - startTime
print("Script took: ", round(time.time() - startTime, 4), "seconds.")
print("=========================")