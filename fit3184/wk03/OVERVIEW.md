# Overview: Cloud Storage

Week 3 covers the shift from localised physical disks to globally distributed, cloud-native storage. It examines the limits of traditional architectures (DAS, SAN, NAS) and how hierarchical file systems strain under modern unstructured data growth and high capital expenditure.

Key ideas:

- The three cloud storage classifications: block storage for low-latency databases, file storage for shared network drives, object storage for flat, web-scale data.
- The CAP Theorem as a lens on consistency, availability, and partition tolerance trade-offs in distributed storage.
- Data lifecycle governance: automated lifecycle rules and storage tiering to optimise cloud spend.

In the lab: configure bucket policies, object access control lists, and logging to protect enterprise data.

## Learning objectives

- Compare block storage, file storage, and object storage across durability, latency, and access patterns.
- Apply the CAP Theorem to predict consistency, availability, and partition tolerance trade-offs in distributed storage layers.
- Design automated storage lifecycle rules and tiering configurations to optimise data retention costs.
- Implement least-privilege object bucket policies and access logs to protect non-public cloud data sets.
