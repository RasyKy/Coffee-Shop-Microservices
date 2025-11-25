# api-gateway/Dockerfile
# ... Build Stage ...
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# ... Run Stage ...
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Use wildcard *.jar
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]