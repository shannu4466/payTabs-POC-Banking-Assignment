package com.bank.poc.system2_corebank.controller;

import lombok.Data;

@Data
public class TransactionRequest {
    private String cardNumber;
    private String pin;
    private double amount;
    private String type;
}
