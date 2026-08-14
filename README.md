# 🚀 Production CI/CD GitOps Platform

A production-style DevOps project demonstrating **CI/CD, Docker, Kubernetes, Helm, GitOps with Argo CD, and monitoring with Prometheus & Grafana** using a single GitHub repository.

The project implements an automated workflow where a developer pushes code to GitHub, GitHub Actions builds and tests the application, creates and publishes a Docker image, updates the Kubernetes Helm configuration, and Argo CD automatically deploys the new version to Kubernetes.

---

## 📌 Project Overview

This project demonstrates an end-to-end DevOps deployment pipeline:

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Install dependencies
    ├── Run tests
    ├── Build Docker image
    ├── Push image to Docker Hub
    └── Update Helm image tag
             │
             ▼
       Git Repository
             │
             ▼
          Argo CD
        (GitOps CD)
             │
             ▼
        Kubernetes
             │
       ┌─────┴─────┐
       ▼           ▼
    Pod 1        Pod 2
       │           │
       └─────┬─────┘
             ▼
        Application
             
Kubernetes Monitoring
        │
        ├── Prometheus
        │
        └── Grafana
```

---

# 🎯 Project Objectives

The main objectives of this project are:

* Automate application testing.
* Containerize the application using Docker.
* Publish Docker images to Docker Hub.
* Implement CI using GitHub Actions.
* Implement continuous deployment using GitOps.
* Manage Kubernetes deployments using Helm.
* Use Argo CD for automated Kubernetes deployment.
* Implement rolling updates.
* Deploy multiple application replicas.
* Monitor Kubernetes and application infrastructure using Prometheus.
* Visualize metrics using Grafana.
* Maintain the complete project in a single Git repository.

---

# 🛠️ Technologies Used

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| Linux / Ubuntu | Development environment           |
| Git            | Version control                   |
| GitHub         | Source code repository            |
| GitHub Actions | CI/CD automation                  |
| Node.js        | Application runtime               |
| npm            | Dependency management and testing |
| Docker         | Application containerization      |
| Docker Hub     | Container image registry          |
| Kubernetes     | Container orchestration           |
| Minikube       | Local Kubernetes cluster          |
| Helm           | Kubernetes package management     |
| Argo CD        | GitOps continuous deployment      |
| Prometheus     | Metrics collection                |
| Grafana        | Monitoring and visualization      |

---

# 📁 Repository Structure

```text
production-cicd-app/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── argocd/
│   └── application.yaml
│
├── helm/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── .helmignore
│   │
│   └── templates/
│       ├── _helpers.tpl
│       ├── deployment.yaml
│       └── service.yaml
│
├── package.json
├── package-lock.json
├── Dockerfile
├── README.md
└── application source files
```

---

# 🔄 CI/CD Workflow

The complete pipeline works as follows.

## 1. Developer pushes code

```bash
git add .
git commit -m "Update application"
git push origin main
```

This triggers the GitHub Actions workflow.

---

## 2. GitHub Actions starts CI

The workflow is located at:

```text
.github/workflows/ci.yml
```

The pipeline performs:

```text
Checkout source code
        ↓
Setup Node.js
        ↓
Install dependencies
        ↓
Run tests
        ↓
Build Docker image
        ↓
Login to Docker Hub
        ↓
Tag Docker image
        ↓
Push image to Docker Hub
        ↓
Update Helm image tag
```

---

# 🧪 Testing

The CI pipeline installs project dependencies:

```bash
npm ci
```

Then runs the automated tests:

```bash
npm test
```

The Docker image is built only as part of the successful CI workflow.

---

# 🐳 Docker

The application is containerized using the `Dockerfile`.

Example build:

```bash
docker build -t production-cicd-app:v1 .
```

The image is published to Docker Hub:

```text
swaroopp03/production-cicd-app
```

Images are tagged using the Git commit SHA.

Example:

```text
swaroopp03/production-cicd-app:550c5ab7133f86899f1a399402084d384b467456
```

Using the Git SHA provides a unique and traceable version for every deployment.

---

# ☸️ Kubernetes

The application is deployed to Kubernetes using Minikube.

The application runs with:

```yaml
replicaCount: 2
```

Therefore Kubernetes maintains two application replicas.

Check the deployment:

```bash
kubectl get deployment -n production
```

Check the pods:

```bash
kubectl get pods -n production
```

Expected result:

```text
NAME                                  READY   STATUS
production-cicd-app-xxxxx             1/1     Running
production-cicd-app-xxxxx             1/1     Running
```

---

# 📦 Helm

Helm is used to package and manage the Kubernetes deployment.

The Helm chart is located at:

```text
helm/
```

Important configuration:

```yaml
namespace: production

replicaCount: 2

image:
  repository: swaroopp03/production-cicd-app
  tag: <git-commit-sha>
  pullPolicy: IfNotPresent

service:
  type: NodePort
  port: 80
```

Helm allows Kubernetes configuration to be managed using reusable templates.

---

# 🔁 GitOps with Argo CD

Argo CD continuously monitors the Git repository.

The Argo CD configuration is:

```text
argocd/application.yaml
```

Argo CD watches:

```text
https://github.com/swaroop-03/production-cicd-app.git
```

and specifically deploys the Helm chart:

```text
helm/
```

The deployment flow is:

```text
GitHub
   ↓
Helm values.yaml changes
   ↓
Argo CD detects Git change
   ↓
Argo CD synchronizes
   ↓
Kubernetes deployment updated
   ↓
New Pods created
   ↓
Old Pods terminated
```

This is the GitOps approach.

---

# 🔄 Rolling Deployment

When a new Docker image is available, Kubernetes performs a rolling update.

For example:

```text
Old Pods
   │
   ├── Pod 1
   └── Pod 2
        ↓
New image detected
        ↓
New Pod created
        ↓
New Pod becomes Ready
        ↓
Old Pod terminated
        ↓
Second new Pod created
        ↓
Old Pod terminated
```

This allows the application to be updated without deleting all replicas simultaneously.

---

# 🔍 Argo CD Verification

Check the Argo CD application:

```bash
kubectl get application production-cicd-app -n argocd
```

Expected:

```text
NAME                  SYNC STATUS   HEALTH STATUS
production-cicd-app   Synced        Healthy
```

`Synced` means Argo CD has synchronized Kubernetes with the Git repository.

`Healthy` means the deployed resources are healthy.

---

# 📊 Monitoring

The Kubernetes cluster is monitored using:

* Prometheus
* Grafana
* kube-state-metrics
* Node Exporter

---

## Prometheus

Prometheus collects Kubernetes and infrastructure metrics.

Check Prometheus:

```bash
kubectl get pods -n monitoring
```

Prometheus service:

```bash
kubectl get svc -n monitoring | grep prometheus
```

Example:

```text
monitoring-kube-prometheus-prometheus
```

Prometheus collects metrics from Kubernetes components and exporters.

---

# 📈 Grafana

Grafana is used to visualize the metrics collected by Prometheus.

Grafana dashboards can be used to monitor:

* CPU usage
* Memory usage
* Pod status
* Kubernetes nodes
* Container metrics
* Network activity
* Cluster resources
* Application infrastructure

The monitoring architecture is:

```text
Kubernetes
    │
    ├── Node Exporter
    ├── kube-state-metrics
    └── Kubernetes metrics
            │
            ▼
        Prometheus
            │
            ▼
         Grafana
            │
            ▼
       Dashboards
```

---

# 🔐 GitHub Secrets

Sensitive credentials are not stored directly in the repository.

GitHub Actions uses repository secrets such as:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
GITOPS_TOKEN
```

These credentials allow GitHub Actions to:

* Authenticate with Docker Hub.
* Push Docker images.
* Update the Git repository.

Secrets should never be committed to Git.

---

# ⚙️ Important Commands

## Git

```bash
git status
git add .
git commit -m "message"
git push origin main
git pull --rebase origin main
git log --oneline -5
```

---

## Docker

```bash
docker build -t production-cicd-app:v1 .
docker images
docker ps
docker pull swaroopp03/production-cicd-app:<TAG>
```

---

## Kubernetes

```bash
kubectl get nodes
kubectl get pods -n production
kubectl get svc -n production
kubectl get deployment -n production
kubectl describe deployment production-cicd-app -n production
```

Check the currently deployed image:

```bash
kubectl get deployment production-cicd-app -n production \
-o jsonpath='{.spec.template.spec.containers[0].image}'; echo
```

---

## Helm

```bash
helm list -n production
helm get manifest production-cicd-app -n production
helm upgrade production-cicd-app helm -n production
```

---

## Argo CD

```bash
kubectl get pods -n argocd
kubectl get applications -n argocd
kubectl get application production-cicd-app -n argocd
```

Check the Git repository:

```bash
kubectl get application production-cicd-app -n argocd \
-o jsonpath='{.spec.source.repoURL}'; echo
```

---

## Monitoring

```bash
kubectl get pods -n monitoring
kubectl get svc -n monitoring
kubectl get svc -n monitoring | grep prometheus
```

---

# 🧪 End-to-End Deployment Test

The complete pipeline can be tested by making a small application change.

```bash
git add .
git commit -m "Update application"
git push origin main
```

Then observe:

### GitHub Actions

```text
GitHub
   ↓
Workflow starts
   ↓
Tests
   ↓
Docker build
   ↓
Docker push
   ↓
Helm update
```

### Argo CD

```text
Git repository changes
        ↓
Argo CD detects change
        ↓
Application becomes OutOfSync
        ↓
Argo CD synchronizes
        ↓
Application becomes Synced
        ↓
Health becomes Healthy
```

### Kubernetes

```bash
kubectl get pods -n production -w
```

A new ReplicaSet and new Pods should appear during the rolling deployment.

---

# 🏗️ Final Architecture

```text
                       ┌─────────────────────┐
                       │      Developer      │
                       └──────────┬──────────┘
                                  │
                              git push
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │       GitHub        │
                       │  Source Repository  │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │   GitHub Actions    │
                       │                     │
                       │  npm test           │
                       │  Docker build       │
                       │  Docker push        │
                       │  Helm update        │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │     Docker Hub      │
                       │  Container Registry │
                       └──────────┬──────────┘
                                  │
                                  │ Image SHA
                                  ▼
                       ┌─────────────────────┐
                       │       Argo CD       │
                       │       GitOps        │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │     Kubernetes      │
                       │      Minikube       │
                       │                     │
                       │  ┌───────────────┐  │
                       │  │ Application   │  │
                       │  │    Pod 1      │  │
                       │  └───────────────┘  │
                       │  ┌───────────────┐  │
                       │  │ Application   │  │
                       │  │    Pod 2      │  │
                       │  └───────────────┘  │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │     Prometheus      │
                       │  Metrics Collection │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │       Grafana       │
                       │      Dashboards     │
                       └─────────────────────┘
```

---

# 📸 Project Screenshots

Add screenshots to this section after uploading them to the repository.

Recommended screenshots:

### 1. GitHub Actions — CI/CD Pipeline

Show:

```text
✓ Tests
✓ Docker Build
✓ Docker Push
✓ Helm Update
```

Suggested file:

```text
screenshots/github-actions.png
```

---

### 2. Argo CD — GitOps Deployment

Show:

```text
Application: production-cicd-app
SYNC: Synced
HEALTH: Healthy
```

Suggested file:

```text
screenshots/argocd.png
```

---

### 3. Grafana — Monitoring Dashboard

Show metrics such as:

* CPU
* Memory
* Pods
* Kubernetes resources

Suggested file:

```text
screenshots/grafana-dashboard.png
```

---

### 4. Kubernetes Pods

Show:

```bash
kubectl get pods -n production
```

with both replicas:

```text
1/1 Running
1/1 Running
```

Suggested file:

```text
screenshots/kubernetes-pods.png
```

---

# 📊 Project Results

The project successfully demonstrates:

| Feature                        | Status |
| ------------------------------ | ------ |
| Source Code Management         | ✅      |
| Automated Testing              | ✅      |
| Docker Containerization        | ✅      |
| Docker Hub Publishing          | ✅      |
| GitHub Actions CI              | ✅      |
| Automated Image Versioning     | ✅      |
| Helm Deployment                | ✅      |
| Kubernetes Deployment          | ✅      |
| Argo CD GitOps                 | ✅      |
| Automated Synchronization      | ✅      |
| Rolling Updates                | ✅      |
| Multiple Replicas              | ✅      |
| Prometheus Monitoring          | ✅      |
| Grafana Visualization          | ✅      |
| Single Repository Architecture | ✅      |

---

# 💡 Key DevOps Concepts Demonstrated

This project provides practical exposure to:

* CI/CD pipelines
* Git workflows
* GitHub Actions
* Docker image lifecycle
* Container registries
* Kubernetes Deployments
* Kubernetes Services
* ReplicaSets
* Rolling updates
* Helm charts
* Helm values
* GitOps
* Argo CD
* Infrastructure monitoring
* Prometheus
* Grafana
* Kubernetes observability
* Secret management
* Automated deployments

---

# 🚀 Future Improvements

Possible production-level improvements include:

* Deploy to AWS EKS instead of Minikube.
* Use an Ingress controller.
* Add HTTPS/TLS.
* Add Horizontal Pod Autoscaling.
* Add Kubernetes Secrets management.
* Add vulnerability scanning using Trivy.
* Add SonarQube/SonarCloud code quality analysis.
* Add centralized logging using Loki.
* Add alerting through Alertmanager.
* Use Terraform to provision cloud infrastructure.
* Use a private container registry.
* Implement environment separation for development, staging, and production.
* Add approval gates for production deployments.

---

# 🎓 Resume Project Description

**Production CI/CD & GitOps Platform**

Designed and implemented an end-to-end CI/CD and GitOps deployment platform using **GitHub Actions, Docker, Kubernetes, Helm, and Argo CD**. Automated application testing, Docker image creation and publishing, Git-based image version updates, and Kubernetes deployments. Implemented rolling updates with multiple replicas and integrated **Prometheus and Grafana** for Kubernetes monitoring and observability.

### Technologies

```text
Git | GitHub | GitHub Actions | Docker | Docker Hub |
Kubernetes | Minikube | Helm | Argo CD |
Prometheus | Grafana | Linux
```

---

# 👨‍💻 Author

**Swaroop**

GitHub:

```text
https://github.com/swaroop-03
```

---

# ⭐ Project Highlights

> **Code → Test → Build → Push → GitOps → Deploy → Monitor**

This project demonstrates a complete modern DevOps workflow using automation and GitOps principles.

