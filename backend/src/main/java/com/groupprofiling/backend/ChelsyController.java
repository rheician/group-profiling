package com.groupprofiling.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.atomic.AtomicInteger;

import java.util.List;

@Controller
@RequestMapping("/portfolio/chelsy")
public class ChelsyController {

    private final AtomicInteger inultiCount = new AtomicInteger();

    private final List<String> inultiMessages = List.of(
            "ARAY KO BOSSING! 1st ulti pa lang masakit na!",
            "DOUBLE KILL! Wala nang natirang HP kay Chelsy!",
            "TRIPLE KILL! Tama na bossing clear naman konsensya ko!",
            "MANIAC! Nag-respawn lang para ma-ulti ulit!",
            "SAVAGE!! GG FRICKING EZ!"
    );

    @GetMapping
    public String showPortfolio(
            @RequestParam(required = false) Boolean sent,
            @RequestParam(required = false) Boolean triggered,
            Model model) {
        model.addAttribute("sent", sent != null && sent);
        model.addAttribute("triggered", triggered != null && triggered);
        model.addAttribute("count", inultiCount.get());

        String statusMessage = inultiCount.get() == 0
                ? "SAFE PA (0 ULTI)"
                : inultiMessages.get((inultiCount.get() - 1) % inultiMessages.size());
        model.addAttribute("statusMessage", statusMessage);
        return "chelsy";
    }

    @PostMapping("/interact")
    public String incrementInulti() {
        inultiCount.incrementAndGet();
        return "redirect:/portfolio/chelsy?triggered=true#ulti-zone";
    }
}