package com.groupprofiling.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
@RequestMapping("/portfolio/radcliff")
public class RadcliffController {

    private final AtomicInteger menacingCount = new AtomicInteger();

    @GetMapping
    public String showPortfolio(@RequestParam(required = false) Boolean sent, Model model) {
        model.addAttribute("sent", sent != null && sent);
        model.addAttribute("count", menacingCount.get());
        return "radcliff";
    }

    @PostMapping("/interact")
    public String incrementMenacing() {
        menacingCount.incrementAndGet();
        return "redirect:/portfolio/radcliff";
    }
}