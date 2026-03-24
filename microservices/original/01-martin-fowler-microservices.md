# Microservices

**By Martin Fowler & James Lewis (2014)**
**Source**: https://martinfowler.com/articles/microservices.html

---

## Definition

The microservice architectural style involves building applications as "suites of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API."

## Characteristics of a Microservice Architecture

### Componentization via Services

Rather than relying solely on libraries, microservices use out-of-process services communicating through web service requests or remote procedure calls. Key advantages include independent deployability—changes to individual services don't require redeploying the entire application.

### Organized around Business Capabilities

Services are structured around business functions rather than technological layers. This approach reflects Conway's Law: organizations tend to produce designs mirroring their communication structures. Cross-functional teams own complete service implementations, including user interfaces, data storage, and external integrations.

### Products not Projects

Teams adopt a long-term product ownership model rather than project-based delivery. Drawing from Amazon's philosophy, developers remain responsible for their services in production, fostering direct accountability to users and business outcomes.

### Smart Endpoints and Dumb Pipes

Microservices favor intelligence residing in service endpoints rather than communication infrastructure. This contrasts sharply with Enterprise Service Bus (ESB) approaches that embed routing logic and transformations in middleware. Services choreograph through "simple RESTish protocols" and lightweight messaging systems like RabbitMQ.

### Decentralized Governance

Organizations avoid mandating single technology platforms across all services. Teams select appropriate languages, frameworks, and databases for specific problems. Rather than enforcing standards bureaucratically, successful teams share battle-tested tools and libraries organically.

### Many Languages, Many Options

Polyglot development becomes practical when services maintain clear boundaries through well-defined contracts. Consumer-driven contracts and tolerant reader patterns enable independent technology evolution across service boundaries.

### Decentralized Data Management

Each service manages its own data storage, a practice called polyglot persistence. This diverges from traditional enterprise database consolidation. Services maintain separate conceptual models aligned with their business contexts, accepting eventual consistency rather than distributed transactions.

### Infrastructure Automation

Continuous delivery practices enable frequent, safe deployments. Automated testing, deployment pipelines, and infrastructure provisioning reduce operational friction. Teams invest in tooling making "the right thing" easier to accomplish.

### Design for Failure

Service failures are inevitable. Applications must gracefully degrade when dependencies become unavailable. Netflix's Simian Army intentionally induces failures during business hours to validate resilience and monitoring capabilities.

### The Circuit Breaker Pattern

Patterns like circuit breaker, bulkhead, and timeout prevent cascading failures. When a service becomes unavailable, circuit breakers prevent repeated requests, allowing recovery time.

### Synchronous Calls Considered Harmful

Heavy synchronous dependencies create multiplicative downtime effects across services. Asynchronous messaging or limiting synchronous calls reduces temporal coupling between services.

### Evolutionary Design

Services should be independently replaceable and upgradeable. Component boundaries evolve as understanding deepens. Organizations often discard temporary services (handling seasonal events) rather than maintaining them indefinitely.

## Comparison to Monolithic Architecture

Traditional monolithic applications concentrate all functionality in a single deployable unit. While straightforward initially, this creates deployment friction: any change requires rebuilding and deploying the entire application. Scaling becomes inefficient—you cannot scale individual features independently.

Microservices address these limitations through independent deployment, scaling, and team ownership, though introducing distributed systems complexity.

## Microservices and SOA

The microservice approach differs fundamentally from earlier Service-Oriented Architecture (SOA) implementations, which often relied on complex Enterprise Service Buses. SOA suffered from "centralized governance models that actively inhibit change." Microservices emphasize lightweight protocols, decentralized decision-making, and organizational autonomy.

## Trade-Offs and Cautions

- **Refactoring challenges**: Moving code across service boundaries proves difficult; interfaces require coordination
- **Complexity migration**: Breaking up a monolith shifts complexity from internal components to service connections, which become less visible
- **Team maturity**: Less skilled teams may struggle with distributed systems complexity
- **Time perspective**: Long-term consequences only become apparent years after architectural decisions

## Future Direction

The authors express cautious optimism while acknowledging insufficient operational history to declare microservices universally superior. They recommend beginning with modular monoliths, converting to microservices when scaling demands necessitate it.

## Early Adopters

Organizations pioneering microservices include Amazon, Netflix, The Guardian, UK Government Digital Service, and others demonstrating viable implementations at scale.
