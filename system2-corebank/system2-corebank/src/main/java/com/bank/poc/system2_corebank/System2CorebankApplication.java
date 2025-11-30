package com.bank.poc.system2_corebank;

import com.bank.poc.system2_corebank.entity.Card;
import com.bank.poc.system2_corebank.repository.CardRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apache.commons.codec.digest.DigestUtils;

@SpringBootApplication
public class System2CorebankApplication {
    @Autowired
    private CardRepository cardRepository;
    public static void main(String[] args) {
        SpringApplication.run(System2CorebankApplication.class, args);
    }

    // Insert 1 Card into DB initially
    @PostConstruct
    public void init() {
        Card c = new Card();
        c.setCardNumber("4123456789012345");
        c.setPinHash(DigestUtils.sha256Hex("1234"));
        c.setBalance(1000);
        c.setCustomerName("Shanmukh");

        cardRepository.save(c);

        System.out.println("Sample card inserted successfully!");
    }
}
