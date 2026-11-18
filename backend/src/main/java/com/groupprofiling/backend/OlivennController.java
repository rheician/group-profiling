package com.groupprofiling.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/portfolio/olivenn")
public class OlivennController {

    // `sent` is set by ProfilingController after a message is submitted
    // from the Leave Message form at the bottom of the page.
    @GetMapping
    public String showPortfolio(@RequestParam(required = false) Boolean sent, Model model) {
        model.addAttribute("sent", sent != null && sent);
        return "olivenn";
    }
}