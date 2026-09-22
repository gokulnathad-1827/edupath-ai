import os
import re

FRONTEND_SRC = r"c:\Users\Gokulnath\Downloads\EduPathAI\frontend\src"

keywords = [
    "mock", "dummy", "demo", "fallback",
    "Rahul", "Priya", "Arun", "Sharma", "Kumar",
    "95%", "92%", "88%", "90%"
]

pattern = re.compile("|".join(keywords), re.IGNORECASE)

findings = []

for root, dirs, files in os.walk(FRONTEND_SRC):
    for f in files:
        if f.endswith((".js", ".jsx", ".ts", ".tsx")):
            fpath = os.path.join(root, f)
            relpath = os.path.relpath(fpath, FRONTEND_SRC)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as file:
                lines = file.readlines()
                for idx, line in enumerate(lines, 1):
                    if pattern.search(line):
                        # Filter out common code comments or imports unless relevant
                        findings.append((relpath, idx, line.strip()))

print(f"Total potential hardcoded references found: {len(findings)}")
for fpath, line_no, content in findings:
    print(f"{fpath}:{line_no} -> {content[:100]}")
