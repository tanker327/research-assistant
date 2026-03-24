# .NET Microservices: Architecture for Containerized .NET Applications

**By Cesar de la Torre, Bill Wagner, Mike Rousos — Microsoft**
**Source**: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/
**Edition**: v7.0 (updated to ASP.NET Core 7.0)

---

## Introduction

This guide is an introduction to developing microservices-based applications and managing them using containers. It discusses architectural design and implementation approaches using .NET and Docker containers.

The guide focuses on a reference containerized and microservice-based application: [eShopOnContainers](https://github.com/dotnet-architecture/eShopOnContainers).

## Action Links

- [Download PDF (English)](https://aka.ms/microservicesebook)
- [eShopOnContainers on GitHub](https://github.com/dotnet-architecture/eShopOnContainers)
- [Introductory Video](https://aka.ms/microservices-video)
- [Microservices Architecture overview](https://aka.ms/MicroservicesArchitecture)

## Why Microservices and Containers

Enterprises are increasingly realizing cost savings, solving deployment problems, and improving DevOps and production operations by using containers. Microsoft has been releasing container innovations for Windows and Linux by creating products like Azure Kubernetes Service and Azure Service Fabric, and by partnering with industry leaders like Docker, Mesosphere, and Kubernetes.

Docker is becoming the de facto standard in the container industry, supported by the most significant vendors in the Windows and Linux ecosystems.

In addition, the microservices architecture is emerging as an important approach for distributed mission-critical applications. In a microservice-based architecture, the application is built on a collection of services that can be developed, tested, deployed, and versioned independently.

## About This Guide

This guide provides foundational development and architectural guidance primarily at a development environment level with a focus on two technologies: Docker and .NET.

It is intended to be infrastructure agnostic and more development-environment-centric. You will make decisions about your infrastructure (cloud or on-premises) later, when you create your production-ready applications.

## What This Guide Does Not Cover

- Application lifecycle, DevOps, CI/CD pipelines, or team work
- Azure infrastructure implementation details
- Specific orchestrator implementation details

See the complementary guide [Containerized Docker Application Lifecycle with Microsoft Platform and Tools](https://aka.ms/dockerlifecycleebook) for those topics.

## Who Should Use This Guide

Written for developers and solution architects who are:
- New to Docker-based application development
- New to microservices-based architecture
- Technical decision makers wanting an architecture and technology overview

## Reference Application: eShopOnContainers

The eShopOnContainers application is an open-source reference app for .NET and microservices designed to be deployed using Docker containers. It consists of:

- Multiple e-store UI front-ends (Web MVC app, Web SPA, native mobile app)
- Back-end microservices and containers for all required server-side operations

> **Note:** IT IS NOT A PRODUCTION-READY TEMPLATE. It is used to showcase architectural patterns and test new technologies.

A new version is being created for .NET 8 with the new [eShop](https://github.com/dotnet/eshop) sample.

## Guide Structure

**Part 1** — Introduction to Docker containers, choosing between .NET 7 and .NET Framework, and overview of microservices. For architects and technical decision makers.

**Part 2** — Development process for Docker-based applications, microservice patterns for implementing applications using .NET and Docker. For developers and architects focused on code and implementation details.

## Credits

**Co-Authors:**
- Cesar de la Torre, Sr. PM, .NET product team, Microsoft Corp.
- Bill Wagner, Sr. Content Developer, C+E, Microsoft Corp.
- Mike Rousos, Principal Software Engineer, DevDiv CAT team, Microsoft

**Notable Reviewers:**
- Jeffrey Richter, Partner Software Eng, Azure team, Microsoft
- Jimmy Bogard, Chief Architect at Headspring
- Udi Dahan, Founder & CEO, Particular Software
- Steve "ardalis" Smith, Software Architect and Trainer
