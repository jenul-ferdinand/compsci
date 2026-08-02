# Overview: Cloud Computing and Virtualisation

Week 2 is a technical deep dive into virtualisation, the engine behind cloud deployment models and resource optimisation. It traces the history of utility computing and unpacks the NIST SP 800-145 definition of cloud computing: five essential characteristics (on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service), three service models, and four deployment models.

Key ideas:

- The service model stack (IaaS, PaaS, SaaS) seen through the shared responsibility model: where provider obligations end and consumer controls begin.
- The hardware privilege model, the conditions for virtualisation, and hypervisor architectures: Type 1 (bare-metal) versus Type 2 (hosted).
- Live migration for real-time load balancing and fault tolerance.

In the lab: configure and deploy different VM types on GCP, compare performance, and simulate elasticity.

## Learning objectives

- Define the five essential characteristics, three service models, and four deployment models of cloud computing per NIST SP 800-145.
- Differentiate Type 1 (bare-metal) and Type 2 (hosted) hypervisors and explain how each abstracts hardware privilege.
- Apply the shared responsibility model to distinguish provider infrastructure obligations from consumer application controls.
- Evaluate VM configurations to match compute workloads with cloud instance capabilities.
