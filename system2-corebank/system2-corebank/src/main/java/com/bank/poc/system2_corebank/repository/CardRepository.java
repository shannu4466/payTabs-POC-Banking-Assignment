package com.bank.poc.system2_corebank.repository;

import com.bank.poc.system2_corebank.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, String> {
}
