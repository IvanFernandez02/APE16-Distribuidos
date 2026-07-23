package com.practica.balanceador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.ResponseEntity;

import org.springframework.context.annotation.DependsOn;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
@DependsOn("databaseConfig")
public class HeartbeatService {

    private final NodoRepository nodoRepository;
    private final RestTemplate restTemplate;

    @Value("${pagos1.url}")
    private String pagos1Url;

    @Value("${pagos2.url}")
    private String pagos2Url;

    @Value("${heartbeat.timeout}")
    private int timeout;

    private final List<NodoConfig> nodos = new ArrayList<>();

    public HeartbeatService(NodoRepository nodoRepository) {
        this.nodoRepository = nodoRepository;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        this.restTemplate = new RestTemplate(factory);
    }

    @PostConstruct
    public void init() {
        // Apply timeouts programmatically after value injection
        SimpleClientHttpRequestFactory factory = (SimpleClientHttpRequestFactory) restTemplate.getRequestFactory();
        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);

        nodos.add(new NodoConfig("Pagos1", pagos1Url));
        nodos.add(new NodoConfig("Pagos2", pagos2Url));
        
        for (NodoConfig n : nodos) {
            nodoRepository.actualizarEstado(n.nombre, "DESCONOCIDO");
        }
    }

    @Scheduled(fixedDelayString = "${heartbeat.interval}")
    public void checkHeartbeats() {
        for (NodoConfig nodo : nodos) {
            String estado = "INACTIVO";
            try {
                ResponseEntity<String> response = restTemplate.getForEntity(nodo.url, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    estado = "ACTIVO";
                }
            } catch (Exception e) {
                estado = "INACTIVO";
            }
            nodoRepository.actualizarEstado(nodo.nombre, estado);
        }
    }

    public List<NodoConfig> getNodosActivos() {
        List<NodoConfig> activos = new ArrayList<>();
        for (NodoConfig n : nodos) {
            if (nodoRepository.nodoEstaActivo(n.nombre)) {
                activos.add(n);
            }
        }
        return activos;
    }

    public static class NodoConfig {
        public String nombre;
        public String url;
        public NodoConfig(String nombre, String url) {
            this.nombre = nombre;
            this.url = url;
        }
    }
}
