FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend-service/pom.xml .
COPY backend-service/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/BackendService.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
