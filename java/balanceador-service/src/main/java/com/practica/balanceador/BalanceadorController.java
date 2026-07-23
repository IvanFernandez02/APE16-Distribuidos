package com.practica.balanceador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class BalanceadorController {

    private final NodoRepository nodoRepository;
    private final HeartbeatService heartbeatService;
    private final RestTemplate restTemplate;
    private final AtomicInteger indiceRr = new AtomicInteger(0);

    public BalanceadorController(NodoRepository nodoRepository, HeartbeatService heartbeatService, 
                                 @Value("${http.timeout:2000}") int httpTimeout) {
        this.nodoRepository = nodoRepository;
        this.heartbeatService = heartbeatService;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(httpTimeout);
        factory.setReadTimeout(httpTimeout);
        this.restTemplate = new RestTemplate(factory);
    }

    @GetMapping("/estado")
    public Map<String, Object> estado() {
        Map<String, Object> response = new HashMap<>();
        response.put("nodos", nodoRepository.obtenerTodos());
        return response;
    }

    @GetMapping("/circuit_log")
    public Map<String, Object> circuitLog() {
        Map<String, Object> response = new HashMap<>();
        response.put("circuit_log", nodoRepository.obtenerCircuitLog());
        return response;
    }

    @PostMapping("/log_circuito")
    public Map<String, Object> logCircuito(@RequestBody Map<String, String> body) {
        String estado = body.getOrDefault("estado", "DESCONOCIDO");
        String detalle = body.getOrDefault("detalle", "");
        nodoRepository.registrarCircuitLog(estado, detalle);
        Map<String, Object> response = new HashMap<>();
        response.put("ok", true);
        return response;
    }

    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> proxyRequest(@RequestBody(required = false) String body) {
        HeartbeatService.NodoConfig nodo = siguienteNodoActivo();
        if (nodo == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "no hay nodos backend activos");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(err);
        }

        try {
            Map<?, ?> respuestaBackend;
            if (body != null && !body.isEmpty()) {
                respuestaBackend = restTemplate.postForObject(nodo.url, body, Map.class);
            } else {
                respuestaBackend = restTemplate.getForObject(nodo.url, Map.class);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("nodo_usado", nodo.nombre);
            response.put("respuesta", respuestaBackend);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            nodoRepository.actualizarEstado(nodo.nombre, "INACTIVO");
            Map<String, Object> err = new HashMap<>();
            err.put("error", "fallo al contactar " + nodo.nombre + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(err);
        }
    }

    private synchronized HeartbeatService.NodoConfig siguienteNodoActivo() {
        List<HeartbeatService.NodoConfig> activos = heartbeatService.getNodosActivos();
        if (activos.isEmpty()) {
            return null;
        }
        int index = indiceRr.getAndIncrement() % activos.size();
        return activos.get(index);
    }
}
