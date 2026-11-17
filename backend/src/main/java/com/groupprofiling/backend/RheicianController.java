package com.groupprofiling.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("/portfolio/rheician")
public class RheicianController {

    private final AtomicInteger breakdownCount = new AtomicInteger();
    private final AtomicInteger activeCardIndex = new AtomicInteger();

    private final List<RheiCard> rheiCards = List.of(
            new RheiCard("001", "cno ba naman ako para piliin mo", "Sino nga ba naman? E nag-iisa lang naman ako sa tabi.", "/images/rj2.jpg"),
            new RheiCard("002", "jo pagod ka na ba?", "Nasusuka na ako sa pinaggagagawa ko sa buhay kaso kailangan pumasa.", "/images/rj3.jpg"),
            new RheiCard("003", "Miss u lods", "Asukal sa kape ko ang pait parang tadhana natin.", "/images/rj1.jpg"),
            new RheiCard("004", "ako na lang kasi :(", "Aaaaah hays nvm napagod na naman ako kakatingin sa screen.", "/images/rj4.jpg"),
            new RheiCard("005", "si ano poh", "Seenzone na naman tayo mga lods.", "/images/rj5.jpg")
    );

    @GetMapping
    public String showPortfolio(
            @RequestParam(required = false) Boolean sent,
            @RequestParam(required = false) Boolean breakdown,
            Model model) {
        model.addAttribute("sent", sent != null && sent);
        model.addAttribute("breakdown", breakdown != null && breakdown);
        model.addAttribute("count", breakdownCount.get());
        model.addAttribute("cards", rheiCards);
        model.addAttribute("activeIndex", activeCardIndex.get());
        return "rheician";
    }

    @PostMapping("/interact")
    public String triggerBreakdown() {
        breakdownCount.incrementAndGet();
        return "redirect:/portfolio/rheician?breakdown=true#archives";
    }

    // Fast, JS-enhanced archive selection: the active card is still saved by Java.
    @PostMapping("/select-card")
    public ResponseEntity<Void> selectCard(@RequestParam int index) {
        if (index < 0 || index >= rheiCards.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid card index");
        }
        activeCardIndex.set(index);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/next-card")
    public String nextStackedCard() {
        activeCardIndex.updateAndGet(index -> (index + 1) % rheiCards.size());
        return "redirect:/portfolio/rheician#archives";
    }
}

record RheiCard(String number, String title, String caption, String image) {}