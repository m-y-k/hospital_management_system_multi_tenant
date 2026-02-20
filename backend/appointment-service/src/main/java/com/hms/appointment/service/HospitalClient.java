package com.hms.appointment.service;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Component
public class HospitalClient {

    private final RestClient restClient;

    public HospitalClient(RestClient.Builder restClientBuilder) {
        // Assuming hospital-service is on port 8082
        this.restClient = restClientBuilder.baseUrl("http://localhost:8082").build();
    }

    public void deductStock(String cid, List<Map<String, Object>> medicines) {
        restClient.post()
                .uri(uriBuilder -> uriBuilder.path("/api/medicines/deduct").queryParam("cid", cid).build())
                .body(medicines)
                .retrieve()
                .toBodilessEntity();
    }

    public void restoreStock(String cid, List<Map<String, Object>> medicines) {
        restClient.post()
                .uri(uriBuilder -> uriBuilder.path("/api/medicines/restore").queryParam("cid", cid).build())
                .body(medicines)
                .retrieve()
                .toBodilessEntity();
    }
}
