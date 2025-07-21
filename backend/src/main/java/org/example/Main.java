package org.example;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@SpringBootApplication
@ComponentScan(basePackages = {"org.example", "session_management"})
@EntityScan(basePackages = "org.example.entity")
@EnableTransactionManagement  // Enable transaction management
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
