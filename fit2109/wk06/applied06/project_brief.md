# Developer handoff: tested environment

The source passed its Python-layer check with:

- Python 3.12
- `requests` 2.31.0

The complete application also calls the system command `curl`. It only reads
`curl --version`; it does not make a network request.

For the container handoff:

- the application must run from `/app`;
- running the image without another command must run `app.py`; and
- another developer must be able to build and run it using `README.md`.

The previous developer did not share a venv or a built image. Recreate and
record the environment instead of copying installed state from another machine.
