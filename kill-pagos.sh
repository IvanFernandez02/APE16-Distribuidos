#!/usr/bin/env bash
# Tumba únicamente los microservicios de Pagos (puertos 9001 y 9002)
# Deja vivos el Balanceador (8080) y Orquestador (8081)

echo "Simulando caída de servidores de Pagos..."
pkill -f "pagos.nombre=Pagos"

echo "¡Los servidores de pagos han sido detenidos!"
