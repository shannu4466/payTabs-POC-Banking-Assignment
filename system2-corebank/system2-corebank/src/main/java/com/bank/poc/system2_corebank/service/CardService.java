package com.bank.poc.system2_corebank.service;

import com.bank.poc.system2_corebank.entity.Card;
import com.bank.poc.system2_corebank.entity.Transaction;
import com.bank.poc.system2_corebank.repository.CardRepository;
import com.bank.poc.system2_corebank.repository.TransactionRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class CardService {
    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;

    public CardService(CardRepository cardRepository, TransactionRepository transactionRepository) {
        this.cardRepository = cardRepository;
        this.transactionRepository = transactionRepository;
    }

    // Convert pin to hash
    private String hashPin(String pin){
        return DigestUtils.sha256Hex(pin);
    }

    // Withdraw or topup
    public String processTransaction(String cardNumber, String pin, double amount, String type){
        Card card = cardRepository.findById(cardNumber).orElse(null);
        if(card == null){
            saveLog(cardNumber,type, amount, "FAILED", "Card Not Found");
            return "Failed: Card not found!";
        }
        // Check pin validation
        String hashedInputPin = hashPin(pin);
        if(!hashedInputPin.equals(card.getPinHash())){
            saveLog(cardNumber, type, amount, "Failed", "Invalid Pin");
            return "Failed: Invalid pin";
        }
        // Check if is withdraw or topup
        if(type.equalsIgnoreCase("withdraw")){
            if(card.getBalance() < amount){
                saveLog(cardNumber, type, amount, "FAILED","Insufficient Balance");
                return "Failed: Insufficient balance";
            }
            card.setBalance(card.getBalance()-amount);
        } else if (type.equalsIgnoreCase("topup")) {
            card.setBalance(card.getBalance()+amount);
        }
        // Saves the card
        cardRepository.save(card);
        saveLog(cardNumber, type, amount, "SUCCESS","");

        return "SUCCESS";
    }
    private void saveLog(String cardNumber, String type, double amount, String status, String reason){
        Transaction tx = new Transaction();
        tx.setCardNumber(cardNumber);
        tx.setType(type);
        tx.setAmount(amount);
        tx.setTimestamp(LocalDateTime.now());
        tx.setStatus(status);
        tx.setReason(reason);

        transactionRepository.save(tx);
    }
}
