#!/usr/bin/env bash
# script para compilar los 3 microservicios en Java

echo "== Compilando pagos-service =="
cd java/pagos-service && mvn clean package -DskipTests
cd ../..

echo "== Compilando balanceador-service =="
cd java/balanceador-service && mvn clean package -DskipTests
cd ../..

echo "== Compilando orquestador-service =="
cd java/orquestador-service && mvn clean package -DskipTests
cd ../..

echo "== Todo compilado exitosamente =="
