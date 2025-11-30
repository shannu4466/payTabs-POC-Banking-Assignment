package com.bank.poc.system2_corebank.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue
    private Long id;
    private String cardNumber;
    private String type;        //topup or withdrawl
    private double amount;

    private LocalDateTime timestamp;

    private String status;      //success or failure
    private String reason;      //reason for failure
}
