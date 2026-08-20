# Overview: Web Services, SOA and Microservices

Week 5 moves from packaging single applications to composing many of them. It traces the path from a monolithic codebase to Service-Oriented Architecture and microservices, where each service is decoupled, independently deployable, and talks to its peers over RESTful APIs.

Key ideas:

- Monolith versus microservices: what independent deployment buys, and the operational overhead it costs in a polyglot stack.
- Resource-oriented REST design: modelling URI paths around resources, choosing the right HTTP method, and returning meaningful status codes.
- Service discovery, so dynamically scaled instances can find each other in ephemeral environments, and API gateways as a single entry point for routing, rate limiting, and client authentication.
- Structural and temporal decoupling, and how distributed systems survive inter-service dependencies and partial failures.
- Resilience in service-to-service calls: structured error objects, timeouts, and basic retry patterns.
- Correlation identifiers propagated across service boundaries to trace one request through every layer it touches.

The running example is a multi-service application: web frontend, identity component, and database layer. The exercise is defining explicit service boundaries and following the data flow across them.

## Learning objectives

- Contrast the structural limitations of monolithic software with the architectural benefits and operational overhead of microservices.
- Model resource-oriented RESTful API pathways applying proper HTTP methods and structural response codes.
- Incorporate structured error objects, timeouts, and basic retry patterns into network service-to-service calls.
- Integrate distributed correlation identifiers across service boundaries to trace execution across disparate application layers.
