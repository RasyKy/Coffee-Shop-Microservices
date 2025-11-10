# Coffee Shop Microservices Project

This is the main project for the Coffee Shop web application, built using a microservice architecture.

##  Prerequisites

Before you begin, make sure you have the following tools installed and also read [CONTRIBUTING.md](CONTRIBUTING.md)

1.  **Git:** To clone the repository.
2.  **[Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/):** To run the entire project. To run the entire project.

---

## How to Run

Create an empty folder to store the project and open it on VScode (or whatever you use) then follow these steps to start working.

**1. Clone the Repository**
Open your terminal and clone the project:

```bash
git clone https://github.com/RasyKy/Coffee-Shop-Microservices.git
```

**2. Go to the Project Directory**

```bash
cd coffee-shop-microservices
```

**3. Run the Project with Docker**

```bash
docker-compose up --build
```

The first time you run this, it may take several minutes to download the base images and build all the services.

If you've successfully run docker-compose up --build, you can now start working on your assigned services.