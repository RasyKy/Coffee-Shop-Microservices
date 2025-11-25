# --- STAGE 1: Build (Compiles the code) ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# --- STAGE 2: Run (Lightweight image) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# FIX: User Service runs on 8084
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]