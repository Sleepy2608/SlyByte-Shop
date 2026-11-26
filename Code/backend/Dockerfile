# ============================================================
# STAGE 1: Build JAR with Maven & Eclipse Temurin JDK 21
# ============================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests

# ============================================================
# STAGE 2: Lightweight Alpine JRE 21 Runtime
# ============================================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Add unprivileged user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built artifact from builder stage
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
