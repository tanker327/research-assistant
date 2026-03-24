# Microservices Architecture Tutorial: All You Need to Get Started

**By Educative**
**Source**: https://dev.to/educative/microservices-architecture-tutorial-all-you-need-to-get-started-232g

---

## What is Microservices Architecture?

Microservices architecture is "an architectural style that structures an application using loosely coupled services" that can be independently developed, deployed, and maintained. This contrasts with traditional monolithic applications where all components are unified into a single codebase.

## Monolithic vs. Microservices

### Monolithic Architecture
- Single, indivisible unit combining server, client, and database
- All updates made to the same codebase
- Becomes complex as scale increases
- Longer development cycles

### Microservices Architecture
- Breaks system into independent services with separate logic and codebases
- Services communicate through APIs
- Easier to scale and customize

### When to Choose Each

**Choose Monolithic if:**
- Your team is small
- You need a quicker initial launch

**Choose Microservices if:**
- You want a more scalable application
- Your company is larger or plans significant growth

## Benefits and Drawbacks

### Benefits

**Improves Scalability and Productivity**
- Projects divided into smaller, independent units
- Teams work autonomously with minimal coordination
- Each team can select their own technology stack

**Integrates Well with Legacy Systems**
- Can work alongside existing monolithic systems
- Helps modernize outdated code

**Sustainable Development**
- System parts remain replaceable and maintainable
- Changes made without compromising the whole system

**Cross-Functionality**
- Ideal for distributed teams worldwide
- Quick technical decisions integrated across services

### Drawbacks

**Deployment Requires More Effort**
- More deployable units to monitor
- Interface changes needed for independent deployment

**Testing Must Be Independent**
- All microservices must be tested together
- One failing service can block deployment of others
- More interfaces to test

**Difficult to Change Multiple Microservices**
- Changes affecting multiple services require coordinated deployments

## Microservices and Docker

Docker provides a lightweight deployment solution for microservices. Rather than complete virtual machines, Docker containers share the operating system kernel, making them efficient and portable.

**Example Dockerfile:**
```dockerfile
FROM openjdk:11.0.2-jre-slim
COPY target/customer.jar .
CMD /usr/bin/java -Xmx400m -Xms400m -jar customer.jar
EXPOSE 8080
```

Multiple Docker containers require coordinated configuration and virtual networking. Docker Compose helps containers discover and communicate with each other through a service discovery system.

## Technology Stacks and Architecture Patterns

### Micro and Macro Architecture Decisions

**Micro Architecture:** Decisions made for each individual microservice

**Macro Architecture:** Global decisions applied to all microservices

Example with databases: Each microservice can have its own database instance (micro approach) or share a schema (macro approach). The former provides better resilience.

### Self-Contained Systems (SCS)

An SCS specifies elements of macro architecture while providing everything needed for one domain logic area, including data storage and UI. They represent "a collection of best practices" with established rules ensuring added features only change one SCS.

### Front-End Integration

Dividing the front end into modularized microservices enables independent domain logic and targeted updates. Integration occurs through links or redirects. However, native mobile applications should remain deployment monoliths.

### Asynchronous Microservices

Asynchronous services don't wait for responses from other microservices. They offer advantages like:
- Greater independence
- System resilience (one failure doesn't crash the whole system)
- Guaranteed processing and delivery

Common technologies include Kafka, REST, and Atom data formats.

### Microservices Platforms

Platforms like Kubernetes and Docker Scheduler support deployment, communication, logging, and monitoring. They enable HTTP/REST with load balancing and service discovery, though migration requires operational changes.
