# eureka-server/Dockerfile
# ... Build Stage (Same as yours) ...
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# ... Run Stage ...
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Use wildcard *.jar to avoid version naming errors
COPY --from=build /app/target/*.jar app.jar

# FIX: Eureka runs on 8761
EXPOSE 8761 
ENTRYPOINT ["java", "-jar", "app.jar"]