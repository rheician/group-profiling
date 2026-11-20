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
import java.util.concurrent.ThreadLocalRandom;

@Controller
@RequestMapping("/portfolio/olivenn")
public class OlivennController {

    private static final String FOUND_KEY = "olivennFound";
    private static final String BACK = "redirect:/portfolio/olivenn#screen-3";
    private static final String DAY_KEY = "olivennDay";
    private static final int FINAL_DAY = 99;

    // Order matches the map coordinates: 1 yellow, 2 green, 3 blue, 4 red, 5 purple.
    private final List<MissingEmotion> emotions = List.of(
            new MissingEmotion("joy", "Joy", "/images/joy.png",
                    "Deserve daw niya kasi, ket indi pa naman?!", 4.1, 5.64, 38.41, 12.14, 51.15,
                    1, "NAG-JOLLIBEE LANG PALA", "Favorite kasi ni Joy ang Chickenjoy",
                    "Huli ka, Joy!", "/images/jabee.png"),
            new MissingEmotion("disgust", "Disgust", "/images/disgust.png",
                    "Pababa na ng bundok.", 79.87, 81.4, 39.58, 89.37, 52.59,
                    2, "NAUNA NANG MAGBAKASYON", "Hiking, green daw kasi, fav niya.",
                    "Baba na!", "/images/hiking.png"),
            new MissingEmotion("sadness", "Sadness", "/images/sadness.png",
                    "Penge raw blue bills :D.", 60.91, 62.44, 40.76, 68.95, 54.93,
                    3, "AYUN, NAGBILANG", "Nagpapademonyo kasi kay Joy eh.",
                    "Tipid-tipid din!", "/images/broke.png"),
            new MissingEmotion("anger", "Anger", "/images/anger.png",
                    "Tilted na 'yan siya.", 42.02, 43.48, 39.58, 49.99, 51.15,
                    4, "NAGLALARO LANG PALA", "Stress reliever o stressor?",
                    "Kalma!", "/images/leg.png"),
            new MissingEmotion("fear", "Fear", "/images/fear.png",
                    "Wait lang daw, 'di pa tapos.", 23.06, 24.6, 39.71, 31.1, 53.88,
                    5, "AY NAGPRE-PRESENT PALA", "Sana raw pasado :>",
                    "Goodluck?", "/images/present.png")
    );

    // Runs before every handler in this controller and puts "emotions" into the Model.
    @ModelAttribute("emotions")
    public List<MissingEmotion> emotions() {
        return emotions;
    }

    // `sent` is set by ProfilingController after the Leave Message form is submitted.
    @GetMapping
    public String showPortfolio(@RequestParam(required = false) Boolean sent, HttpSession session, Model model) {
        fill(model, session, sent != null && sent);
        return "olivenn";
    }

    // Only reachable once all 5 are found; otherwise bounce back to the base.
    @GetMapping("/ending")
    public String ending(HttpSession session, Model model) {
        if (foundSet(session).size() < emotions.size()) return BACK;
        fill(model, session, false);
        model.addAttribute("ending", true);
        model.addAttribute("endDay", FINAL_DAY + 1);
        return "olivenn";
    }

    // "Hanapin si X" button inside a location section; the slug comes from the URL path.
    @PostMapping("/find/{slug}")
    public String find(@PathVariable String slug, HttpSession session, RedirectAttributes ra) {
        MissingEmotion e = emotions.stream()
                .filter(x -> x.slug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown emotion"));
        Set<String> found = foundSet(session);
        int before = session.getAttribute(DAY_KEY) instanceof Integer d ? d : 1;
        boolean isNew = found.add(e.slug());
        if (isNew) {
            advanceDay(session, emotions.size() - found.size());
            ra.addFlashAttribute("prevDay", before);
        }
        ra.addFlashAttribute("message",
                isNew ? e.name() + " nahanap na! " + e.hint() : e.name() + " nahanap mo na, bes.");
        return BACK;
    }

    @PostMapping("/reset")
    public String reset(HttpSession session, RedirectAttributes ra) {
        foundSet(session).clear();
        session.setAttribute(DAY_KEY, 1);
        ra.addFlashAttribute("message", "Asaan nanaman ang mga taong ito?!");
        return BACK;
    }

    private void fill(Model model, HttpSession session, boolean sent) {
        Set<String> found = foundSet(session);
        model.addAttribute("sent", sent);
        model.addAttribute("found", found);
        model.addAttribute("foundCount", found.size());
        model.addAttribute("day", session.getAttribute(DAY_KEY) instanceof Integer d ? d : 1);
    }

    // Random jump, but always leaves room so the last find lands exactly on Day 99.
    private void advanceDay(HttpSession session, int remaining) {
        int day = session.getAttribute(DAY_KEY) instanceof Integer d ? d : 1;
        if (remaining == 0) {
            day = FINAL_DAY;
        } else {
            int maxStep = Math.max(1, (FINAL_DAY - day) / (remaining + 1));
            day += 1 + ThreadLocalRandom.current().nextInt(maxStep);
        }
        session.setAttribute(DAY_KEY, day);
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
                      int loc, String place, String teaser,
                      String button, String photo) {}