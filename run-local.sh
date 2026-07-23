#!/usr/bin/env bash
# script para levantar todo localmente para pruebas

# Asegurar que se detengan todos los procesos al presionar Ctrl+C
trap 'kill 0' SIGINT

echo "Arrancando Pagos1 en puerto 9001..."
java -jar java/pagos-service/target/pagos-service-0.0.1-SNAPSHOT.jar --server.port=9001 --pagos.nombre=Pagos1 &
sleep 2

echo "Arrancando Pagos2 en puerto 9002..."
java -jar java/pagos-service/target/pagos-service-0.0.1-SNAPSHOT.jar --server.port=9002 --pagos.nombre=Pagos2 &
sleep 2

echo "Arrancando Balanceador en puerto 8080..."
java -jar java/balanceador-service/target/balanceador-service-0.0.1-SNAPSHOT.jar &
sleep 2

echo "Arrancando Orquestador en puerto 8081..."
java -jar java/orquestador-service/target/orquestador-service-0.0.1-SNAPSHOT.jar &
sleep 2

echo "=========================================================="
echo "Todos los servicios están corriendo."
echo "Para abrir el frontend, ejecuta en otra terminal:"
echo "cd frontend && npm run dev"
echo "Presiona Ctrl+C para detener todos los servicios Java."
echo "=========================================================="

wait
