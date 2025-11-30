package com.bank.poc.system2_corebank.repository;

import com.bank.poc.system2_corebank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
