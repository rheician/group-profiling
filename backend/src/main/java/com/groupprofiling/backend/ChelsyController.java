package com.groupprofiling.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;

@Controller
@RequestMapping("/portfolio/chelsy")
public class ChelsyController {
    private static final String SAVE_KEY = ChelsyController.class.getName() + ".sides";
    private static final String INVITE_KEY = ChelsyController.class.getName() + ".invite";
    private static final int MIN_NAME_LENGTH = 2;
    private static final int MAX_NAME_LENGTH = 60;
    private static final int MAX_NAME_WORDS = 5;
    private static final int MAX_LETTERS_PER_WORD = 20;
    private static final String NAME_LETTER = "\\p{L}\\p{M}*";
    private static final String NAME_WORD = NAME_LETTER
            + "(?:(?:['’]|-)?" + NAME_LETTER + "){0," + (MAX_LETTERS_PER_WORD - 1) + "}";
    private static final Pattern NAME_PATTERN =
            Pattern.compile(" *" + NAME_WORD + "(?: +" + NAME_WORD + "){0," + (MAX_NAME_WORDS - 1) + "} *");
    private static final String NAME_RULES =
            ("Use %d to %d characters, up to %d words, and at most %d letters per word. "
                    + "Letters, spaces, hyphens, and apostrophes are allowed.")
                    .formatted(MIN_NAME_LENGTH, MAX_NAME_LENGTH, MAX_NAME_WORDS, MAX_LETTERS_PER_WORD);
    private static final ZoneId MANILA = ZoneId.of("Asia/Manila");
    private static final DateTimeFormatter APPOINTMENT = DateTimeFormatter.ofPattern("EEE, MMM d, uuuu 'at' h:mm a",
            java.util.Locale.ENGLISH);
    private static final List<String> GAMES = List.of(
            "GTA 6", "Dungeons and Dragons", "Left 4 Dead 2", "Genshin", "Baldur’s Gate 3", "Persona 5",
            "Dispatch", "Omori", "Elden Ring", "Resident Evil", "Final Fantasy"
    );
    private static final List<String> NCR = List.of(
            "Intramuros, Manila", "SM Mall of Asia, Pasay", "BGC High Street, Taguig",
            "UP Diliman, Quezon City", "Quezon Memorial Circle, Quezon City"
    );
    private static final List<String> CALABARZON = List.of(
            "Tagaytay, Cavite", "Nuvali, Laguna", "Antipolo, Rizal", "Batangas City, Batangas", "Lucena, Quezon"
    );

    private final ResourceLoader resources;

    public ChelsyController(ResourceLoader resources) {
        this.resources = resources;
    }

    @GetMapping("/launch")
    public String launch(Model model) {
        model.addAttribute("coverImage", ChelsyBodies.COVER_IMAGE);
        return "chelsy-launch";
    }

    @GetMapping
    public String showPortfolio(HttpServletRequest request, Model model) {
        return render(request, model, Map.of(), Map.of());
    }

    @PostMapping("/invite")
    public String invite(@RequestParam(defaultValue = "") String name,
                         @RequestParam(defaultValue = "") String activity,
                         @RequestParam(defaultValue = "") String game,
                         @RequestParam(defaultValue = "") String place,
                         @RequestParam(defaultValue = "") String day,
                         @RequestParam(defaultValue = "") String time,
                         HttpServletRequest request, HttpServletResponse response,
                         Model model, RedirectAttributes redirect) {
        boolean validName = name.length() <= MAX_NAME_LENGTH && NAME_PATTERN.matcher(name).matches();
        name = name.strip();
        Map<String, String> errors = new LinkedHashMap<>();
        if (!validName || name.length() < MIN_NAME_LENGTH) {
            errors.put("name", NAME_RULES);
        }

        boolean playing = activity.equals("play");
        boolean hangingOut = activity.equals("hangout");
        boolean goodGame = GAMES.contains(game);
        boolean goodPlace = NCR.contains(place) || CALABARZON.contains(place);
        if (!playing && !hangingOut) {
            errors.put("activity", "Pick Play a game or Hang out.");
        } else if (playing && (!goodGame || !place.isEmpty())) {
            errors.put("game", "Choose one listed game and leave the hangout location blank.");
        } else if (hangingOut && (!goodPlace || !game.isEmpty())) {
            errors.put("place", "Choose one listed location and leave the game blank.");
        }

        LocalDateTime when = null;
        if (!day.matches("[0-9]{4}-[0-9]{2}-[0-9]{2}")) {
            errors.put("day", "Choose a valid day.");
        }
        if (!time.matches("[0-9]{2}:[0-9]{2}")) {
            errors.put("time", "Choose a valid time.");
        }
        if (!errors.containsKey("day") && !errors.containsKey("time")) {
            try {
                when = LocalDateTime.parse(day + "T" + time);
                if (!when.isAfter(LocalDateTime.now(MANILA))) {
                    errors.put("time", "Pick a future date and time in the Philippines.");
                }
            } catch (DateTimeParseException ignored) {
                errors.put("time", "Choose a real date and time.");
            }
        }

        if (!errors.isEmpty()) {
            response.setStatus(422);
            return render(request, model, Map.of(
                    "name", name.length() <= MAX_NAME_LENGTH ? name : "",
                    "activity", playing || hangingOut ? activity : "",
                    "game", playing && goodGame ? game : "",
                    "place", hangingOut && goodPlace ? place : "",
                    "day", day.length() == 10 ? day : "",
                    "time", time.length() == 5 ? time : ""
            ), errors);
        }

        Invite receipt = new Invite(name, playing ? game : place, when.format(APPOINTMENT));
        request.getSession().setAttribute(INVITE_KEY, receipt);
        redirect.addFlashAttribute("inviteSaved", true);
        return "redirect:/portfolio/chelsy#invite";
    }

    private String render(HttpServletRequest request, Model model,
                          Map<String, String> form, Map<String, String> errors) {
        model.addAttribute("zones", ChelsyBodies.ZONES);
        model.addAttribute("bodyCount", ChelsyBodies.PEOPLE.size());
        model.addAttribute("contextPath", request.getContextPath());
        model.addAttribute("games", GAMES);
        model.addAttribute("ncr", NCR);
        model.addAttribute("calabarzon", CALABARZON);
        model.addAttribute("earliest", LocalDate.now(MANILA));
        model.addAttribute("namePattern", NAME_PATTERN.pattern());
        model.addAttribute("nameRules", NAME_RULES);
        model.addAttribute("minNameLength", MIN_NAME_LENGTH);
        model.addAttribute("maxNameLength", MAX_NAME_LENGTH);
        model.addAttribute("form", form);
        model.addAttribute("errors", errors);
        HttpSession session = request.getSession(false);
        if (session != null && Boolean.TRUE.equals(model.asMap().get("inviteSaved"))) {
            model.addAttribute("receipt", session.getAttribute(INVITE_KEY));
        }
        Game existing = session == null ? null : (Game) session.getAttribute(SAVE_KEY);
        int recovered = 0;
        if (existing != null) {
            synchronized (existing) {
                recovered = existing.discovered.size();
            }
        }
        model.addAttribute("recoveredCount", recovered);
        return "chelsy";
    }

    @GetMapping("/journal")
    @ResponseBody
    public Journal journal(HttpSession session) {
        Game game = game(session);
        synchronized (game) {
            return new Journal(game.discovered.stream().map(this::revealData).toList());
        }
    }

    @PostMapping("/pickup")
    @ResponseBody
    public Pickup pickup(@RequestParam String zone, @RequestParam UUID run, HttpSession session) {
        List<ChelsyBodies.Person> people = ChelsyBodies.PEOPLE.stream()
                .filter(person -> person.zone().equals(zone)).toList();
        if (people.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown zone");
        }

        Game game = game(session);
        synchronized (game) {
            if (run.equals(game.lastRun) && game.pending != null) {
                if (!game.pending.person().zone().equals(zone)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Already carrying a body");
                }
                return new Pickup(game.pending.token());
            }

            List<ChelsyBodies.Person> unseen = people.stream()
                    .filter(person -> !game.discovered.contains(person)).toList();
            List<ChelsyBodies.Person> pool = unseen.isEmpty() ? people : unseen;
            ChelsyBodies.Person person = pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
            game.lastRun = run;
            game.pending = new Claim(UUID.randomUUID(), person);
            return new Pickup(game.pending.token());
        }
    }

    @PostMapping("/drop")
    @ResponseBody
    public void drop(@RequestParam UUID token, HttpSession session) {
        Game game = game(session);
        synchronized (game) {
            if (game.pending != null && game.pending.token().equals(token)) {
                game.pending = null;
            }
        }
    }

    @PostMapping("/reveal")
    @ResponseBody
    public Reveal reveal(@RequestParam UUID token, HttpSession session) {
        Game game = game(session);
        synchronized (game) {
            if (game.lastReveal != null && game.lastReveal.token().equals(token)) {
                return revealData(game.lastReveal.person());
            }
            if (game.pending == null || !game.pending.token().equals(token)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Pick up a mystery body first");
            }
            Claim claim = game.pending;
            game.discovered.add(claim.person());
            game.lastReveal = claim;
            game.pending = null;
            return revealData(claim.person());
        }
    }

    private Game game(HttpSession session) {
        synchronized (session) {
            Game game = (Game) session.getAttribute(SAVE_KEY);
            if (game == null) {
                game = new Game();
                session.setAttribute(SAVE_KEY, game);
            }
            return game;
        }
    }

    private Reveal revealData(ChelsyBodies.Person person) {
        ChelsyBodies.Zone zone = ChelsyBodies.ZONES.stream()
                .filter(item -> item.id().equals(person.zone())).findFirst().orElseThrow();
        String photo = "/images/chelsy/" + person.id() + ".jpg";
        String sound = "/sounds/chelsy/" + person.id() + ".mp3";
        return new Reveal(person.id(), person.name(), zone.group(), zone.color(), person.description(),
                resources.getResource("classpath:/static" + photo).exists() ? photo : "",
                resources.getResource("classpath:/static" + sound).exists() ? sound : "");
    }

    private static class Game {
        private final Set<ChelsyBodies.Person> discovered = new LinkedHashSet<>();
        private UUID lastRun;
        private Claim pending;
        private Claim lastReveal;
    }

    private record Claim(UUID token, ChelsyBodies.Person person) {}
    public record Pickup(UUID token) {}
    public record Journal(List<Reveal> items) {}
    public record Reveal(String id, String name, String group, String color, String description, String photo,
                         String sound) {}
    public record Invite(String name, String choice, String schedule) {}
}