import sys

import requests


EXPECTED_REQUESTS = "2.31.0"
actual = requests.__version__

print(f"tested requests version: {EXPECTED_REQUESTS}")
print(f"installed requests version: {actual}")

if actual != EXPECTED_REQUESTS:
    print("MISMATCH: this is not the direct package version recorded by the developer.")
    sys.exit(1)

print("PASS: the tested direct package version is installed.")
