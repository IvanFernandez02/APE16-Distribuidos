package com.practica.pagos;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class PagosController {

    @Value("${pagos.nombre:Pagos}")
    private String nombreNodo;

    @GetMapping("/")
    public Map<String, Object> heartbeat() {
        Map<String, Object> response = new HashMap<>();
        response.put("nodo", nombreNodo);
        response.put("estado", "ACTIVO");
        response.put("timestamp", System.currentTimeMillis() / 1000.0);
        return response;
    }

    @PostMapping("/")
    public Map<String, Object> procesarPago(@RequestBody(required = false) String body) {
        Map<String, Object> response = new HashMap<>();
        response.put("nodo", nombreNodo);
        response.put("resultado", "pago procesado");
        response.put("recibido", body != null ? body : "{}");
        System.out.println("[" + nombreNodo + "] procesando pago: " + (body != null ? body : "{}"));
        return response;
    }
}
