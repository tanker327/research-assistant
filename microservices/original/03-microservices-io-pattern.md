# Microservice Architecture Pattern

**By Chris Richardson**
**Source**: https://microservices.io/patterns/microservices.html

---

## Overview

The Microservice Architecture pattern structures applications as a collection of independently deployable, loosely coupled components organized around business capabilities. This approach enables organizations to deliver changes rapidly while maintaining team autonomy.

## Context

Development teams operate within the framework of small, cross-functional units practicing DevOps and continuous deployment. "A team is responsible for one or more subdomains. A subdomain is an implementable model of a slice of business functionality." Teams must balance competing forces while maintaining system reliability.

## Problem & Solution

The core challenge involves organizing subdomains into deployable components. The pattern proposes: "Design an architecture that structures the application as a set of two or more independently deployable, loosely coupled, components, a.k.a. services."

## Key Forces

### Dark Energy Forces (favoring decomposition)
- Simple components improve maintainability
- Team autonomy enables independent development
- Fast deployment pipelines require efficient testing
- Support for multiple technology stacks
- Segregation by operational characteristics

### Dark Matter Forces (favoring consolidation)
- Simple interactions reduce complexity
- Efficient interactions minimize latency
- ACID transactions outperform eventual consistency
- Minimized runtime coupling improves availability
- Reduced design-time coupling increases productivity

## Benefits & Drawbacks

**Advantages:**
- Simplified services
- Team independence
- Rapid deployments
- Technology flexibility
- Characteristic-based segregation

**Challenges:**
- "Some distributed operations might be complex, and difficult to understand and troubleshoot"
- Potentially inefficient
- Requires eventually consistent transaction management

## Design Patterns

Related architectural patterns address specific challenges:

- **Service collaboration**: Saga, CQRS, API composition
- **Communication styles**: Messaging, RPC
- **Data management**: Database per service
- **Access**: API Gateway
- **Infrastructure**: Discovery patterns, testing and observability patterns

## Known Applications

Major technology companies including Netflix, Amazon, and eBay have successfully adopted microservice architectures at scale.
