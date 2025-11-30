package com.bank.poc.system2_corebank.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Card {
    @Id
    private String cardNumber;
    private String pinHash;
    private double balance;
    private String customerName;
}
