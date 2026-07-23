package com.practica.balanceador;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class NodoRepository {

    private final JdbcTemplate jdbcTemplate;

    public NodoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void actualizarEstado(String nombre, String estado) {
        long timestamp = System.currentTimeMillis() / 1000;
        jdbcTemplate.update("""
            INSERT INTO estado_nodos (nodo, estado, ultima_actualizacion)
            VALUES (?, ?, ?)
            ON CONFLICT(nodo) DO UPDATE SET
                estado=excluded.estado,
                ultima_actualizacion=excluded.ultima_actualizacion
            """, nombre, estado, timestamp);
    }

    public boolean nodoEstaActivo(String nombre) {
        List<String> estados = jdbcTemplate.query(
            "SELECT estado FROM estado_nodos WHERE nodo=?",
            (rs, rowNum) -> rs.getString("estado"),
            nombre
        );
        return !estados.isEmpty() && "ACTIVO".equals(estados.get(0));
    }

    public List<Object[]> obtenerTodos() {
        return jdbcTemplate.query("SELECT nodo, estado, ultima_actualizacion FROM estado_nodos", (rs, rowNum) -> {
            return new Object[]{rs.getString("nodo"), rs.getString("estado"), rs.getDouble("ultima_actualizacion")};
        });
    }

    public void registrarCircuitLog(String estadoCircuito, String detalle) {
        long timestamp = System.currentTimeMillis() / 1000;
        jdbcTemplate.update(
            "INSERT INTO circuit_log (estado_circuito, timestamp, detalle) VALUES (?, ?, ?)",
            estadoCircuito, timestamp, detalle != null ? detalle : ""
        );
    }

    public List<Object[]> obtenerCircuitLog() {
        return jdbcTemplate.query("SELECT estado_circuito, timestamp, detalle FROM circuit_log ORDER BY id", (rs, rowNum) -> {
            return new Object[]{rs.getString("estado_circuito"), rs.getDouble("timestamp"), rs.getString("detalle")};
        });
    }
}
