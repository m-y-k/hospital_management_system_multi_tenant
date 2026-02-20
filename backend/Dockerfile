# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the parent pom and all service poms
COPY pom.xml .
COPY common/pom.xml common/
COPY auth-service/pom.xml auth-service/
COPY hospital-service/pom.xml hospital-service/
COPY appointment-service/pom.xml appointment-service/

# Download dependencies (this layer is cached)
RUN mvn dependency:go-offline -B

# Copy source code
COPY common/src common/src
COPY auth-service/src auth-service/src
COPY hospital-service/src hospital-service/src
COPY appointment-service/src appointment-service/src

# Build the project
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-slim
WORKDIR /app

# The SERVICE_NAME argument will determine which jar to run
ARG SERVICE_NAME
ENV SERVICE_NAME_ENV=${SERVICE_NAME}

# Copy the built jar from the build stage
COPY --from=build /app/${SERVICE_NAME}/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
