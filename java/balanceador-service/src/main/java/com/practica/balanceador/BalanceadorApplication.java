package com.practica.balanceador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BalanceadorApplication {
    public static void main(String[] args) {
        SpringApplication.run(BalanceadorApplication.class, args);
    }
}
