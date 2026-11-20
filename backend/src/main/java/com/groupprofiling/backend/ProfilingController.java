package com.groupprofiling.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class ProfilingController {

    private final List<TeamMember> teamMembers = new ArrayList<>();
    // Safe for concurrent visits; still intentionally in-memory (no database).
    private final List<FeedbackMessage> feedbackList = new CopyOnWriteArrayList<>();
    private final AtomicLong feedbackIds = new AtomicLong();

    public ProfilingController() {
        teamMembers.add(new TeamMember("Chelsy", "Developer", "/portfolio/chelsy/launch", "Steal a Chelsy", "95% Rating", ChelsyBodies.COVER_IMAGE));
        teamMembers.add(new TeamMember("Olivenn", "Developer", "/portfolio/olivenn", "99 Nights ng Ano?", "92% Rating", "/images/99.png"));
        teamMembers.add(new TeamMember("Rheician", "Developer", "/portfolio/rheician", "#UndasDanas", "98% Rating", "/images/scary1.jpg"));
        teamMembers.add(new TeamMember("Radcliff", "Developer", "/portfolio/radcliff", "Radcliff", "96% Rating", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80"));
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("members", teamMembers);
        model.addAttribute("feedbacks", feedbackList);
        return "home";
    }

    @PostMapping("/feedback")
    public String submitFeedback(
            @RequestParam String recipient,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String message) {

        // An allowed portfolio route is required, so a forged recipient cannot redirect anywhere else.
        String slug = recipient.trim().toLowerCase(Locale.ROOT);
        if (!List.of("chelsy", "olivenn", "rheician", "radcliff").contains(slug)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown member");
        }
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, hh:mm a"));
        feedbackList.add(0, new FeedbackMessage(
                feedbackIds.incrementAndGet(),
                recipient,
                name,
                email,
                message,
                timestamp
        ));

        return "redirect:/portfolio/" + slug + "?sent=true" + (slug.equals("rheician") ? "#connect" : "");
    }

    @PostMapping("/feedback/delete")
    public String deleteFeedback(@RequestParam long id) {
        feedbackList.removeIf(item -> item.id() == id);
        return "redirect:/";
    }
}

record TeamMember(String name, String role, String link, String gameTitle, String rating, String image) {}
record FeedbackMessage(long id, String recipient, String name, String email, String message, String timestamp) {}