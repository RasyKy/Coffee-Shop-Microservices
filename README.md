# Coffee Shop Microservices Project

This is the main project for the Coffee Shop web application, built using a microservice architecture.

##  Prerequisites

Before you begin, make sure you have the following tools installed on your local machine.

1.  **Git:** To clone the repository.
2.  **Docker Desktop:** To run the entire project.

---

## How to Run

Follow these steps to get the entire application (all 9 containers) running on your machine.

**1. Clone the Repository**
Open your terminal and clone the project:

```bash
git clone https://github.com/RasyKy/Coffee-Shop-Microservices.git
```

**2. Go to the Project Directory**

```bash
cd coffee-shop-microservices
```

**3. Run the Project with Docker This is the only command you need. It will build all the service images (Java, Node, Angular) and start all the containers.**

```bash
docker-compose up --build
```

The first time you run this, it may take several minutes to download the base images and build all the services.