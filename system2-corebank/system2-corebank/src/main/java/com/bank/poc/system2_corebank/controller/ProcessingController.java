package com.bank.poc.system2_corebank.controller;

import com.bank.poc.system2_corebank.entity.Card;
import com.bank.poc.system2_corebank.entity.Transaction;
import com.bank.poc.system2_corebank.repository.CardRepository;
import com.bank.poc.system2_corebank.repository.TransactionRepository;
import com.bank.poc.system2_corebank.service.CardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/process")
@CrossOrigin("*")
public class ProcessingController {
    private final CardService cardSerive;
    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;

    public ProcessingController(CardService cardSerive, CardRepository cardRepository, TransactionRepository transactionRepository) {
        this.cardSerive = cardSerive;
        this.cardRepository = cardRepository;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping
    public String processTransaction(@RequestBody TransactionRequest req){
        return cardSerive.processTransaction(
                req.getCardNumber(),
                req.getPin(),
                req.getAmount(),
                req.getType()
        );
    }

    // Get Balance
    @GetMapping("/balance/{cardNumber}")
    public double getBalance(@PathVariable String cardNumber){
        return cardRepository.findById(cardNumber)
                .map(Card::getBalance).orElse(0.0);
    }

    // Get transaction for one user based on card number (for the user logged in )
    @GetMapping("/transactions/{cardNumber}")
    public List<Transaction> getCustomerTransactions(@PathVariable String cardNumber){
        return transactionRepository.findAll().stream().filter(t->t.getCardNumber().equals(cardNumber)).toList();
    }

    // Get all transaction (for admin)
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions(){
        return transactionRepository.findAll();
    }
}
