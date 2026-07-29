# Applied 1 notes: GCP networking lab

Custom VPC, two Ubuntu VMs, diagnostics between them. Steps in `applied01.pdf`; these notes cover what it omits.

## Setup

- `custom-network-lab`, custom subnet mode. Subnet `subnet-us-central1` in `us-central1`, `192.168.1.0/24`.
- Two VMs, E2 custom 2 vCPU / 4 GB, Ubuntu 24.04 LTS minimal, zone `us-central1-a`. Got `192.168.1.2` and `.3`.

## Gotchas

- A custom VPC has zero firewall rules. Ingress is default-deny, so SSH and ping fail until you add tcp:22 and icmp allows.
- The "Allow HTTP/HTTPS" checkboxes add network tags plus matching firewall rules. Those rules block network deletion later.
- Minimal Ubuntu lacks ping, dig, traceroute. Install on each VM.
- GCP's interface is `ens4`, not `eth0`. Check with `ip a`.
- tcpdump buffers writes to a file; packets appear when it exits.
- `* * *` in traceroute: the hop refuses to reply. Google's internal routers do this.
- Delete in order: instances, firewall rules, subnet, network.

## Commands

```bash
gcloud compute networks create custom-network-lab --subnet-mode=custom
gcloud compute networks subnets create subnet-us-central1 \
  --network=custom-network-lab --region=us-central1 --range=192.168.1.0/24
gcloud compute firewall-rules create custom-allow-ssh \
  --network=custom-network-lab --allow=tcp:22 --source-ranges=0.0.0.0/0
gcloud compute instances create vm-instance-1 --zone=us-central1-a \
  --machine-type=e2-custom-2-4096 --network=custom-network-lab \
  --subnet=subnet-us-central1 --image-family=ubuntu-minimal-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud
gcloud compute ssh vm-instance-1 --zone=us-central1-a
sudo tcpdump -ni ens4 icmp        # ping from the wire side
sudo ss -tlnp                     # listeners; netstat -tulnp is the legacy form
```

## Self-check

- Why does VM 2 pinging VM 1 work? The ingress icmp rule on the receiving side. Egress is allow-all, so the sender needs nothing.
- `0.0.0.0:22 LISTEN`? sshd accepts port 22 on all interfaces.
- Sub-millisecond ping between VMs? Same zone; traffic stays inside Google.
