# Digital Wallet Platform
### Secure Microservices Architecture with NestJS, GraphQL & Docker

This is a clone of a  **production-grade digital wallet platform** built using **NestJS microservices**, **GraphQL Gateway**, **Kafka**, and **PostgreSQL**, following **Hexagonal Architecture**, **SOLID principles**, **Docker best practices**, and **OWASP Top 10 (2025)** security guidelines.

This project is designed as a **real-world reference architecture** for secure financial systems.

---

## 🧱 High-Level Architecture

Client (Web / Mobile)
        |
        v
GraphQL Gateway (BFF)
        |
 Auth | Wallet | Payments
        |
     PostgreSQL
        |
      Kafka

---

## 🔐 Security – OWASP Top 10 (2025)

| OWASP Risk | Mitigation |
|-----------|-----------|
Broken Access Control | JWT Guards (Gateway & Services) |
Injection | class-validator + whitelist |
Auth Failures | Access + Refresh token strategy |
Sensitive Data Exposure | bcrypt + JWT secrets |
Security Misconfiguration | Zod env validation |
Excessive Resource Consumption | Rate limiting |
CSRF | Apollo CSRF protection |
Information Disclosure | Error sanitization |
Dependency Risks | Minimal Docker images |

---

## 🐳 Docker Best Practices Implemented
### ✅ Multi-Stage Builds
### ✅ Small & Secure Images
### ✅ Non-Root Containers
### ✅ Deterministic Builds
### ✅ Environment Configuration
### ✅ Health & Dependency Control

---

## 🚀 Running the Project

``docker compose build``

``docker compose up``

---

