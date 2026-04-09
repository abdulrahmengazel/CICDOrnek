FROM maven:3.9.13-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 4343

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
