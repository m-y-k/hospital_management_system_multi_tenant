package com.hms.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.hms.hospital", "com.hms.common"})
public class HospitalServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HospitalServiceApplication.class, args);
    }
}
