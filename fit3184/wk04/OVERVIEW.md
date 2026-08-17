# Overview: Containerisation in the Cloud

Week 4 moves from virtual machines to OS-level virtualisation. It treats the "works on my machine" deployment problem as a packaging problem, and container images as immutable release artifacts that carry application code and its user-space dependencies together.

Key ideas:

- The kernel mechanisms underneath containers: namespaces isolate what a process can see (PID, network, mount), while cgroups enforce hard limits on what it can consume (CPU, memory, block I/O).
- The OCI image lifecycle: layered filesystems, Dockerfile layer ordering, build cache behaviour, and registries.
- Deployment models compared across self-managed VMs, managed cluster environments, and serverless container runtimes.
- Architectural concerns: the observability pillars (logs, metrics, traces, events), port-forwarding networks, and container security risks such as kernel escapes and privileged containers.

In the lab: provision a GCP VM and reach it over SSH from VS Code, build a Python YOLO object detection API into a container image, push it to a registry, deploy it as a live service, and stress test it with Locust.

## Learning objectives

- Differentiate container isolation (OS-level namespaces and cgroups) from hardware virtualisation.
- Author optimised Dockerfiles using multi-stage builds and precise layer ordering to reduce final image size.
- Coordinate multi-container deployment stacks locally using environment parameter injection and persistent disk volumes.
- Execute standard OCI image registry operations to securely tag, push, and reference release components.
