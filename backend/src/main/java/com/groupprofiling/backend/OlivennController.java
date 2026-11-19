package com.groupprofiling.backend;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/portfolio/olivenn")
public class OlivennController {

    private static final String FOUND_KEY = "olivennFound";
    private static final String BACK = "redirect:/portfolio/olivenn#screen-3";

    // Order matches the map coordinates: 1 yellow, 2 green, 3 blue, 4 red, 5 purple.
    private final List<MissingEmotion> emotions = List.of(
            new MissingEmotion("joy", "Joy", "/images/joy.png",
                    "Nag-leave daw, nag-Tagaytay para mag-move on.", 4.1, 5.64, 38.41, 12.14, 51.15,
                    1, "TAGAYTAY VIEW DECK", "Nagpapa-picture at nagko-kape ng 150 pesos."),
            new MissingEmotion("disgust", "Disgust", "/images/disgust.png",
                    "Nag-walk out nung may nag-lagay ng pinya sa pizza.", 79.87, 81.4, 39.58, 89.37, 52.59,
                    2, "PIZZA PLACE (HAWAIIAN ONLY)", "May pinya. Naka-mask siya pero ramdam ang pandidiri."),
            new MissingEmotion("sadness", "Sadness", "/images/sadness.png",
                    "Umiiyak pa rin kasi 74% ang final grade.", 60.91, 62.44, 40.76, 68.95, 54.93,
                    3, "ILALIM NG HAGDAN", "May hawak na tissue at 74% na grade."),
            new MissingEmotion("anger", "Anger", "/images/anger.png",
                    "Nag-rant sa group chat tapos na-seen lang.", 42.02, 43.48, 39.58, 49.99, 51.15,
                    4, "GC NA NA-SEEN", "Nagta-type... nagbubura... nagta-type ulit."),
            new MissingEmotion("fear", "Fear", "/images/fear.png",
                    "Nagtago sa ilalim ng kama kasi may deadline bukas.", 23.06, 24.6, 39.71, 31.1, 53.88,
                    5, "ILALIM NG KAMA", "Nanginginig kasi bukas na ang deadline.")
    );

    // Runs before every handler in this controller and puts "emotions" into the Model.
    @ModelAttribute("emotions")
    public List<MissingEmotion> emotions() {
        return emotions;
    }

    // `sent` is set by ProfilingController after the Leave Message form is submitted.
    @GetMapping
    public String showPortfolio(@RequestParam(required = false) Boolean sent,
                                HttpSession session, Model model) {
        fill(model, session, sent != null && sent);
        return "olivenn";
    }

    // Only reachable once all 5 are found; otherwise bounce back to the base.
    @GetMapping("/ending")
    public String ending(HttpSession session, Model model) {
        if (foundSet(session).size() < emotions.size()) return BACK;
        fill(model, session, false);
        model.addAttribute("ending", true);
        return "olivenn";
    }

    // "Hanapin si X" button inside a location section; the slug comes from the URL path.
    @PostMapping("/find/{slug}")
    public String find(@PathVariable String slug, HttpSession session, RedirectAttributes ra) {
        MissingEmotion e = emotions.stream()
                .filter(x -> x.slug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown emotion"));
        boolean isNew = foundSet(session).add(e.slug());
        ra.addFlashAttribute("message",
                isNew ? e.name() + " nahanap! " + e.hint() : e.name() + " nahanap mo na, bes.");
        return BACK;
    }

    @PostMapping("/reset")
    public String reset(HttpSession session, RedirectAttributes ra) {
        foundSet(session).clear();
        ra.addFlashAttribute("message", "Nawawala na naman silang lahat. Tradisyon na.");
        return BACK;
    }

    private void fill(Model model, HttpSession session, boolean sent) {
        Set<String> found = foundSet(session);
        model.addAttribute("sent", sent);
        model.addAttribute("found", found);
        model.addAttribute("foundCount", found.size());
    }

    @SuppressWarnings("unchecked")
    private Set<String> foundSet(HttpSession session) {
        Set<String> found = (Set<String>) session.getAttribute(FOUND_KEY);
        if (found == null) {
            found = new LinkedHashSet<>();
            session.setAttribute(FOUND_KEY, found);
        }
        return found;
    }
}

record MissingEmotion(String slug, String name, String image, String hint,
                      double padLeft, double faceLeft, double faceTop,
                      double markLeft, double markTop,
                      int loc, String place, String teaser) {}