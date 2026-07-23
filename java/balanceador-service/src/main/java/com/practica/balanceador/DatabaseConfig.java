package com.practica.balanceador;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initDatabase() {
        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS estado_nodos (
                nodo TEXT PRIMARY KEY,
                estado TEXT NOT NULL,
                ultima_actualizacion REAL NOT NULL
            )
        """);

        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS circuit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                estado_circuito TEXT NOT NULL,
                timestamp REAL NOT NULL,
                detalle TEXT
            )
        """);
        System.out.println("[Balanceador] Esquema de BD listo en nodos.db");
    }
}
