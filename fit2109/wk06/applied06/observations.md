# Week 6 observations

## 1. Dependency drift and venv handoff

TODO: Record the version selected by the unpinned install. Explain why install
time can change the selected version, and why the project shares
`requirements.txt` rather than a copied `.venv` directory.

## 2. requirements.txt and Dockerfile

TODO: Explain what environment state each file records. Include at least one
thing that `requirements.txt` does not record.

## 3. Source change, stale image, and rebuild

TODO: Record your prediction and result when the host source changed but the
image was not rebuilt. Explain what `docker build` creates and what each
`docker run --rm` creates and removes.
