package com.groupprofiling.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
@RequestMapping("/portfolio/olivenn")
public class OlivennController {

    private final AtomicInteger vouchCount = new AtomicInteger();

    @GetMapping
    public String showPortfolio(
            @RequestParam(required = false) Boolean sent,
            @RequestParam(required = false) Boolean vouched,
            Model model) {
        model.addAttribute("sent", sent != null && sent);
        model.addAttribute("vouched", vouched != null && vouched);
        model.addAttribute("count", vouchCount.get());
        return "olivenn";
    }

    @PostMapping("/interact")
    public String incrementVouch() {
        vouchCount.incrementAndGet();
        return "redirect:/portfolio/olivenn?vouched=true";
    }
}