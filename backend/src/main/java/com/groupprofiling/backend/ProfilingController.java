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
        // The "games" are creative portfolio experiences. Ratings are demo display values,
        // not scores gathered from real players.
        teamMembers.add(new TeamMember(
                "chelsy", "Chelsy", "Developer", "/portfolio/chelsy", "Steal an Egg: Mamaaaa",
                "95%", "/images/steal.png", "Comedy", "A meme-filled world of unpredictable surprises.",
                "Enter Chelsy's playful corner of ROLBOX, with surprising Q&As, meme reveals, " +
                "an elusive button, and an INULTIHAN interaction counter. Leave your own message " +
                "in her guestbook before heading back to the lobby.",
                List.of("Meme reveal interactions", "Runaway secret button", "INULTIHAN counter", "Guestbook")
        ));
        teamMembers.add(new TeamMember(
                "olivenn", "Olivenn", "Developer", "/portfolio/olivenn", "99 Nights ng Pagdurusa",
                "92%", "https://play-lh.googleusercontent.com/viOjN7Ax5NtKXc3GdhAz4g8Ij8gq9eNnZv5cLFmYbDrQAu49qDuKYZS-kljLOzjefpgnL57CkkMRQKWcydqURA=w526-h296-rw",
                "Atmosphere", "Neon-pink lightfalls and an atmospheric escape.",
                "Explore Olivenn's forest-green world filled with falling lights, " +
                "animated lettering, and a VOUCH button. Get to know the creator and send a message.",
                List.of("Animated Lightfall background", "Shimmering typography", "VOUCH counter", "Guestbook")
        ));
        teamMembers.add(new TeamMember(
                "rheician", "Rheician", "Developer", "/portfolio/rheician", "#UndasDanas",
                "98%", "/images/scary1.jpg", "Story", "A collection of Rhei's chaotic chapters.",
                "Shuffle through the different sides of Rhei in an interactive archive, " +
                "activate the emotional breakdown effect, and explore creative projects " +
                "and portfolio links along the way.",
                List.of("Interactive card archive", "Emotional breakdown effect", "Animated vinyl artwork", "Creative portfolio links")
        ));
        teamMembers.add(new TeamMember(
                "radcliff", "Radcliff", "Developer", "/portfolio/radcliff", "Radcliff",
                "96%", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
                "Manga", "An expressive, manga-inspired introduction.",
                "Take a trip into Radcliff's stylized manga panels. Discover interests " +
                "and personality details, trigger the menacing counter, and write in the guestbook.",
                List.of("Manga-inspired layout", "Menacing interaction", "Personal profile panels", "Guestbook")
        ));
    }

    // Game details are served by Java + Thymeleaf; profile routes stay unchanged.
    @GetMapping("/games/{slug}")
    public String gamePreview(@PathVariable String slug, Model model) {
        TeamMember game = teamMembers.stream()
                .filter(member -> member.slug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Experience not found"));
        model.addAttribute("game", game);
        model.addAttribute("otherGames", teamMembers.stream()
                .filter(member -> !member.slug().equals(slug))
                .toList());
        return "game-preview";
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

record TeamMember(
        String slug, String name, String role, String link, String gameTitle,
        String rating, String image, String genre, String tagline,
        String description, List<String> features
) {}
record FeedbackMessage(long id, String recipient, String name, String email, String message, String timestamp) {}