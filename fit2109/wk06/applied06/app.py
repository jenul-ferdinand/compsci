import subprocess

import requests


APP_VERSION = "version 1"


def main():
    print(f"FIT2109 environment project - {APP_VERSION}", flush=True)
    print(f"requests {requests.__version__}", flush=True)

    result = subprocess.run(
        ["curl", "--version"],
        check=True,
        capture_output=True,
        text=True,
    )
    print(result.stdout.splitlines()[0])


if __name__ == "__main__":
    main()
