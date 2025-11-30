package com.bank.poc.system1_gateway.controller;

import org.jspecify.annotations.Nullable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@CrossOrigin("*")
public class TransactionController {
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/transaction")
    public String handleTransaction(@RequestBody TransactionRequest req){
        if(!req.getCardNumber().startsWith("4")){
            return "FAILED: Card Not Supported";
        }
        String url = "http://localhost:8082/process";
        return restTemplate.postForObject(url,req,String.class);
    }

    @GetMapping("/transactions")
    public @Nullable List getAllTransactions() {
        String url = "http://localhost:8082/process/transactions";
        return restTemplate.getForObject(url, List.class);
    }

    @GetMapping("/transactions/{cardNumber}")
    public @Nullable List getUserTransactions(@PathVariable String cardNumber) {
        String url = "http://localhost:8082/process/transactions/" + cardNumber;
        return restTemplate.getForObject(url, List.class);
    }

    @GetMapping("/balance/{cardNumber}")
    public Double getBalance(@PathVariable String cardNumber) {
        String url = "http://localhost:8082/process/balance/" + cardNumber;
        return restTemplate.getForObject(url, Double.class);
    }
}
