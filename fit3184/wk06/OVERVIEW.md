# Overview: Container Orchestration in the Cloud

Week 6 moves from running containers to operating them under load. It starts with the vocabulary for saying what "under load" actually means, separating load from throughput, capacity, and latency percentiles, then asks what to do when one machine stops being enough.

Key ideas:

- Vertical scaling (a bigger machine) against horizontal scale-out (more machines), and why stateless services scale out cleanly while stateful ones carry the session or data that makes replication hard.
- Load balancer routing, where health checks decide which backends receive traffic and pull failing ones out of rotation.
- Kubernetes as a desired-state control system: you declare what should be running and a control loop reconciles reality against it. The orchestration primitives are Pods, Deployments, ReplicaSets, Ingress, and the Gateway API.
- Operating for availability: Horizontal Pod Autoscaling and cluster autoscaling, rolling update strategies, Pod Disruption Budgets, and topology spread constraints across multi-zone failure domains.

In the lab: push a container image to a registry repository, provision a managed GKE cluster from the web UI, deploy it with a single replica and baseline the performance with Locust, then configure HPA and a load balancer for scaling and high availability.

## Learning objectives

- Contrast vertical and horizontal scaling models and analyse their compatibility with stateless versus stateful component designs.
- Explain the routing mechanisms of cloud load balancers.
- Configure Kubernetes liveness and readiness probes to automate traffic isolation from failing backend containers.
