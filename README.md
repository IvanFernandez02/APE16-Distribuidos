# Práctica 15 y 16 — Balanceo, Heartbeat y Circuit Breaker (Java Spring Boot)

Esta es la implementación en **Java (Spring Boot)** de las prácticas 15 y 16 sobre Sistemas Distribuidos.

## Arquitectura

El sistema consta de 5 máquinas (o terminales si corres en localhost):
- **Máquina 1:** Microservicio de Pagos (Instancia 1) - Puerto 9001
- **Máquina 2:** Microservicio de Pagos (Instancia 2) - Puerto 9002
- **Máquina 3:** Balanceador de Carga + Heartbeat - Puerto 8080 (SQLite DB)
- **Máquina 4:** Orquestador + Circuit Breaker - Puerto 8081
- **Máquina 5:** Cliente (Dashboard Web React)

## Cómo compilar

Necesitas tener **Java 17+** y **Maven** instalados.

```bash
./build.sh
```
Esto compilará los 3 microservicios y generará los archivos `.jar` en las carpetas `target/`.

## Cómo probar en Localhost (Una sola máquina)

Para desarrollar o presentar en una sola computadora, existe un script que arranca todos los servicios en background:

```bash
./run-local.sh
```

Y luego arranca el frontend en otra terminal:
```bash
cd frontend
npm install  # (Solo la primera vez)
npm run dev
```

Abre `http://localhost:5173` y verás el dashboard interactivo. Puedes detener todos los servicios Java presionando `Ctrl+C` en la terminal donde ejecutaste `run-local.sh`.

## Cómo desplegar en 5 Máquinas Físicas

1. Compila el código (`./build.sh`).
2. Copia la carpeta a todas las máquinas.
3. Edita los archivos `application.properties` en las máquinas 3 y 4 para apuntar a las IPs reales de tu red (ej. en vez de `127.0.0.1`, pon `192.168.1.X`).
4. Ejecuta cada servicio en su máquina respectiva:

**Máquina 1:**
```bash
java -jar java/pagos-service/target/pagos-service-0.0.1-SNAPSHOT.jar --server.port=9001 --pagos.nombre=Pagos1
```
**Máquina 2:**
```bash
java -jar java/pagos-service/target/pagos-service-0.0.1-SNAPSHOT.jar --server.port=9002 --pagos.nombre=Pagos2
```
**Máquina 3:**
```bash
java -jar java/balanceador-service/target/balanceador-service-0.0.1-SNAPSHOT.jar
```
**Máquina 4:**
```bash
java -jar java/orquestador-service/target/orquestador-service-0.0.1-SNAPSHOT.jar
```
**Máquina 5 (Frontend):**
```bash
cd frontend && npm run dev -- --host 0.0.0.0
```
Entra desde el navegador en la IP de la máquina 5. ¡Asegúrate de entrar al "Engranaje" del frontend y poner las IPs reales de la Máquina 3 y 4!
