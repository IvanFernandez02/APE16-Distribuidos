package com.practica.orquestador;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class OrquestadorController {

    private final CircuitBreaker circuitBreaker;
    private final RestTemplate restTemplate;

    @Value("${balanceador.url}")
    private String balanceadorUrl;

    @Value("${circuitbreaker.umbral-fallos:3}")
    private int umbralFallos;

    @Value("${circuitbreaker.tiempo-half-open:10}")
    private int tiempoHalfOpen;

    @Value("${http.timeout:2000}")
    private int httpTimeout;

    public OrquestadorController(CircuitBreaker circuitBreaker) {
        this.circuitBreaker = circuitBreaker;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        this.restTemplate = new RestTemplate(factory);
    }

    @PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory factory = (SimpleClientHttpRequestFactory) restTemplate.getRequestFactory();
        factory.setConnectTimeout(httpTimeout);
        factory.setReadTimeout(httpTimeout);

        circuitBreaker.setConfig(umbralFallos, tiempoHalfOpen, this::registrarCircuitoRemoto);
    }

    private void registrarCircuitoRemoto(String nuevoEstado, String detalle) {
        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("estado", nuevoEstado);
            payload.put("detalle", detalle);
            restTemplate.postForObject(balanceadorUrl + "log_circuito", payload, Map.class);
        } catch (Exception e) {
            System.err.println("[Orquestador] no se pudo registrar circuit_log remoto: " + e.getMessage());
        }
    }

    @GetMapping("/estado_circuito")
    public Map<String, Object> estadoCircuito() {
        Map<String, Object> response = new HashMap<>();
        response.put("estado_circuito", circuitBreaker.getEstado());
        return response;
    }

    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> proxyRequest(@RequestBody(required = false) String body) {
        if (!circuitBreaker.permitePeticion()) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("fuente", "fallback-circuit-breaker");
            fallback.put("estado_circuito", circuitBreaker.getEstado());
            fallback.put("mensaje", "Servicio de pagos no disponible temporalmente. Intenta más tarde.");
            return ResponseEntity.ok(fallback);
        }

        try {
            Map<?, ?> respuestaBalanceador;
            if (body != null && !body.isEmpty()) {
                respuestaBalanceador = restTemplate.postForObject(balanceadorUrl, body, Map.class);
            } else {
                respuestaBalanceador = restTemplate.getForObject(balanceadorUrl, Map.class);
            }
            
            circuitBreaker.registrarExito();
            
            Map<String, Object> response = new HashMap<>();
            response.put("estado_circuito", circuitBreaker.getEstado());
            response.put("respuesta_balanceador", respuestaBalanceador);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            circuitBreaker.registrarFallo();
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("fuente", "fallback-circuit-breaker");
            fallback.put("estado_circuito", circuitBreaker.getEstado());
            fallback.put("error", e.getMessage());
            fallback.put("mensaje", "Fallo al contactar el balanceador. Respuesta alternativa entregada.");
            return ResponseEntity.ok(fallback);
        }
    }
}
