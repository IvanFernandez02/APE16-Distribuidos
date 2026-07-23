package com.practica.orquestador;

import org.springframework.stereotype.Component;

import java.util.function.BiConsumer;

@Component
public class CircuitBreaker {

    public static final String CERRADO = "CLOSED";
    public static final String ABIERTO = "OPEN";
    public static final String SEMI_ABIERTO = "HALF_OPEN";

    private final int umbralFallos;
    private final int tiempoReintentoSegundos;
    private BiConsumer<String, String> onCambioEstado;

    private String estado = CERRADO;
    private int fallosConsecutivos = 0;
    private Long momentoApertura = null;

    public CircuitBreaker() {
        this.umbralFallos = 3;
        this.tiempoReintentoSegundos = 10;
    }

    public void setConfig(int umbralFallos, int tiempoReintentoSegundos, BiConsumer<String, String> onCambioEstado) {
        // En un caso real usaríamos final y constructor injection, pero para que coincida con el Python de la práctica:
        this.onCambioEstado = onCambioEstado;
    }

    public synchronized String getEstado() {
        revisarTransicionHalfOpen();
        return estado;
    }

    private void revisarTransicionHalfOpen() {
        if (ABIERTO.equals(estado) && momentoApertura != null) {
            long tiempoActual = System.currentTimeMillis() / 1000;
            if (tiempoActual - momentoApertura >= tiempoReintentoSegundos) {
                cambiarEstado(SEMI_ABIERTO, "timeout de reintento cumplido");
            }
        }
    }

    private void cambiarEstado(String nuevoEstado, String detalle) {
        String anterior = this.estado;
        this.estado = nuevoEstado;
        if (ABIERTO.equals(nuevoEstado)) {
            this.momentoApertura = System.currentTimeMillis() / 1000;
        }
        if (!anterior.equals(nuevoEstado) && onCambioEstado != null) {
            onCambioEstado.accept(nuevoEstado, detalle);
        }
    }

    public synchronized boolean permitePeticion() {
        revisarTransicionHalfOpen();
        return CERRADO.equals(estado) || SEMI_ABIERTO.equals(estado);
    }

    public synchronized void registrarExito() {
        fallosConsecutivos = 0;
        if (SEMI_ABIERTO.equals(estado)) {
            cambiarEstado(CERRADO, "petición de prueba exitosa");
        }
    }

    public synchronized void registrarFallo() {
        if (SEMI_ABIERTO.equals(estado)) {
            cambiarEstado(ABIERTO, "fallo en petición de prueba (half-open)");
            return;
        }
        fallosConsecutivos++;
        if (fallosConsecutivos >= umbralFallos && CERRADO.equals(estado)) {
            cambiarEstado(ABIERTO, fallosConsecutivos + " fallos consecutivos");
        }
    }
}
