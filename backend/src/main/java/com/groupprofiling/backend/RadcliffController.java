package com.groupprofiling.backend;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
@RequestMapping("/portfolio/radcliff")
public class RadcliffController {

    private static final String STEEL_BALL_UNLOCKED = "radcliffSteelBallUnlocked";
    private static final String WONDER_OF_U_UNLOCKED = "radcliffWonderOfUUnlocked";
    private static final String WONDER_OF_U_TARGET_CELL = "radcliffWonderOfUTargetCell";
    private static final String MYSTERY_UNLOCKED = "radcliffMysteryUnlocked";
    private static final String ROHAN_CURRENT_ROUND = "radcliffRohanCurrentRound";
    private static final String ROHAN_WRONG_CHOICES = "radcliffRohanWrongChoices";
    private static final String ROHAN_CORRECT_ANSWER = "radcliffRohanCorrectAnswer";
    private static final int WONDER_OF_U_CELL_COUNT = 25;

    private static final List<RadcliffGame> GAMES = List.of(
            new RadcliffGame("steel-ball", "STEEL BALL", "AIM & SHOOT",
                    "Reserved and quiet, he keeps to himself.",
                    "/images/Steel%20Ball.png"),
            new RadcliffGame("wonder-of-u", "WONDER OF U", "HALLWAY CHASE",
                    "He enjoys drawing, gaming, and imagining things.",
                    "/images/Wonder_of_U_Manga.png"),
            new RadcliffGame("mystery", "GUESSING GAME", "GUESSING GAME",
                    "He dreams of creating original works. How whimsical.",
                    "/images/Rohan_DagaKotowaru.png")
    );

    private static final List<GuessingRound> ROHAN_GUESSING_ROUNDS = List.of(
            new GuessingRound("/images/Josuke4.png",
                    List.of("Jotaro Kujo", "Johnny Joestar", "Joseph Joestar", "Josuke Higashikata"),
                    Set.of("Josuke Higashikata"), null),
            new GuessingRound("/images/Josuke8.png",
                    List.of("Jonathan Joestar", "Jolyne Cujoh", "Josuke Higashikata", "Jobin"),
                    Set.of("Josuke Higashikata"), "It's confusing."),
            new GuessingRound("/images/Kira1.png",
                    List.of("Kosaku Kawajiri", "Yoshikage Kira", "Yoshihiro Kira", "Dio"),
                    Set.of("Yoshikage Kira"), null),
            new GuessingRound("/images/Kira2.png",
                    List.of("Kosaku Kawajiri", "Yoshikage Kira", "Yoshihiro Kira", "Dio"),
                    Set.of("Kosaku Kawajiri", "Yoshikage Kira"), "They're the same person"),
            new GuessingRound("/images/Kira3.png",
                    List.of("Kosaku Kawajiri", "Yoshikage Kira", "Yoshihiro Kira", "Dio"),
                    Set.of("Kosaku Kawajiri", "Yoshikage Kira"), "They're the same person... again"),
            new GuessingRound("/images/Kira4.png",
                    List.of("Norisuke Higashikata", "Yoshikage Kira", "Fumi-kun", "Josefumi"),
                    Set.of("Yoshikage Kira"), "This time they're different people!")
    );

    private final AtomicInteger menacingCount = new AtomicInteger();

    @GetMapping
    public String showPortfolio(@RequestParam(required = false) Boolean sent, HttpSession session, Model model) {
        boolean steelBallUnlocked = Boolean.TRUE.equals(session.getAttribute(STEEL_BALL_UNLOCKED));
        boolean wonderOfUUnlocked = Boolean.TRUE.equals(session.getAttribute(WONDER_OF_U_UNLOCKED));
        boolean mysteryUnlocked = Boolean.TRUE.equals(session.getAttribute(MYSTERY_UNLOCKED));
        model.addAttribute("sent", sent != null && sent);
        model.addAttribute("count", menacingCount.get());
        model.addAttribute("games", GAMES);
        model.addAttribute("steelBallUnlocked", steelBallUnlocked);
        model.addAttribute("wonderOfUUnlocked", wonderOfUUnlocked);
        model.addAttribute("mysteryUnlocked", mysteryUnlocked);
        model.addAttribute("allPanelsUnlocked", steelBallUnlocked && wonderOfUUnlocked && mysteryUnlocked);
        return "radcliff";
    }

    @GetMapping("/games/{gameId}")
    public String showGame(@PathVariable String gameId,
                           @RequestParam(required = false) Boolean miss,
                           HttpSession session,
                           Model model) {
        RadcliffGame game = GAMES.stream()
                .filter(candidate -> candidate.id().equals(gameId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown Radcliff game"));
        if ("steel-ball".equals(gameId)) {
            model.addAttribute("victory", Boolean.TRUE.equals(session.getAttribute(STEEL_BALL_UNLOCKED)));
            return "radcliff-steel-ball";
        }
        if ("wonder-of-u".equals(gameId)) {
            boolean victory = Boolean.TRUE.equals(session.getAttribute(WONDER_OF_U_UNLOCKED));
            model.addAttribute("victory", victory);
            model.addAttribute("miss", Boolean.TRUE.equals(miss));
            if (!victory) {
                model.addAttribute("targetCell", getOrCreateWonderOfUTarget(session));
            }
            return "radcliff-wonder-of-u";
        }
        if ("mystery".equals(gameId)) {
            boolean completed = Boolean.TRUE.equals(session.getAttribute(MYSTERY_UNLOCKED));
            model.addAttribute("completed", completed);
            int roundIndex = completed
                    ? ROHAN_GUESSING_ROUNDS.size() - 1
                    : getCurrentRohanRound(session);
            GuessingRound round = ROHAN_GUESSING_ROUNDS.get(roundIndex);
            model.addAttribute("roundNumber", roundIndex + 1);
            model.addAttribute("questionImage", round.image());
            model.addAttribute("choices", round.choices());
            model.addAttribute("correctAnswers", round.correctAnswers());
            model.addAttribute("wrongAnswers", getRohanWrongAnswers(session));
            model.addAttribute("correctAnswer", session.getAttribute(ROHAN_CORRECT_ANSWER));
            model.addAttribute("roundNote", round.note());
            return "radcliff-rohan-quiz";
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No game view for " + game.id());
    }

    @PostMapping("/games/steel-ball/shoot")
    public String shootSteelBall(HttpSession session) {
        session.setAttribute(STEEL_BALL_UNLOCKED, true);
        return "redirect:/portfolio/radcliff/games/steel-ball";
    }

    @PostMapping("/games/wonder-of-u/find")
    public String findWonderOfU(@RequestParam int cell, HttpSession session) {
        if (cell < 0 || cell >= WONDER_OF_U_CELL_COUNT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Grid cell must be between 0 and 24");
        }

        if (cell == getOrCreateWonderOfUTarget(session)) {
            session.setAttribute(WONDER_OF_U_UNLOCKED, true);
            session.removeAttribute(WONDER_OF_U_TARGET_CELL);
            return "redirect:/portfolio/radcliff/games/wonder-of-u";
        }
        return "redirect:/portfolio/radcliff/games/wonder-of-u?miss=true";
    }

    @PostMapping("/games/mystery/answer")
    public String answerRohanQuiz(@RequestParam String answer, HttpSession session) {
        if (Boolean.TRUE.equals(session.getAttribute(MYSTERY_UNLOCKED))) {
            return "redirect:/portfolio/radcliff/games/mystery";
        }

        int roundIndex = getCurrentRohanRound(session);
        GuessingRound round = ROHAN_GUESSING_ROUNDS.get(roundIndex);
        if (!round.choices().contains(answer)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Answer must be one of the displayed choices");
        }
        if (session.getAttribute(ROHAN_CORRECT_ANSWER) != null) {
            return "redirect:/portfolio/radcliff/games/mystery";
        }

        if (round.correctAnswers().contains(answer)) {
            if (roundIndex == ROHAN_GUESSING_ROUNDS.size() - 1) {
                session.setAttribute(ROHAN_CORRECT_ANSWER, answer);
                session.setAttribute(MYSTERY_UNLOCKED, true);
            } else {
                session.setAttribute(ROHAN_CORRECT_ANSWER, answer);
            }
        } else {
            Set<String> wrongAnswers = getRohanWrongAnswers(session);
            wrongAnswers.add(answer);
            session.setAttribute(ROHAN_WRONG_CHOICES, wrongAnswers);
        }
        return "redirect:/portfolio/radcliff/games/mystery";
    }

    @PostMapping("/games/mystery/next")
    public String nextRohanQuizRound(HttpSession session) {
        if (Boolean.TRUE.equals(session.getAttribute(MYSTERY_UNLOCKED))) {
            return "redirect:/portfolio/radcliff/games/mystery";
        }
        if (session.getAttribute(ROHAN_CORRECT_ANSWER) == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Answer the current round correctly to continue");
        }

        int nextRound = getCurrentRohanRound(session) + 1;
        if (nextRound >= ROHAN_GUESSING_ROUNDS.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The final round completes the game");
        }
        session.setAttribute(ROHAN_CURRENT_ROUND, nextRound);
        session.removeAttribute(ROHAN_WRONG_CHOICES);
        session.removeAttribute(ROHAN_CORRECT_ANSWER);
        return "redirect:/portfolio/radcliff/games/mystery";
    }

    @PostMapping("/interact")
    public String incrementMenacing() {
        menacingCount.incrementAndGet();
        return "redirect:/portfolio/radcliff";
    }

    private int getOrCreateWonderOfUTarget(HttpSession session) {
        Object targetCell = session.getAttribute(WONDER_OF_U_TARGET_CELL);
        if (targetCell instanceof Integer cell) {
            return cell;
        }

        int cell = ThreadLocalRandom.current().nextInt(WONDER_OF_U_CELL_COUNT);
        session.setAttribute(WONDER_OF_U_TARGET_CELL, cell);
        return cell;
    }

    private int getCurrentRohanRound(HttpSession session) {
        Object currentRound = session.getAttribute(ROHAN_CURRENT_ROUND);
        if (currentRound instanceof Integer roundIndex
                && roundIndex >= 0
                && roundIndex < ROHAN_GUESSING_ROUNDS.size()) {
            return roundIndex;
        }

        session.setAttribute(ROHAN_CURRENT_ROUND, 0);
        session.removeAttribute(ROHAN_WRONG_CHOICES);
        session.removeAttribute(ROHAN_CORRECT_ANSWER);
        return 0;
    }

    private Set<String> getRohanWrongAnswers(HttpSession session) {
        Object storedAnswers = session.getAttribute(ROHAN_WRONG_CHOICES);
        if (storedAnswers instanceof Set<?> answers) {
            Set<String> wrongAnswers = new HashSet<>();
            for (Object answer : answers) {
                if (answer instanceof String choice) {
                    wrongAnswers.add(choice);
                }
            }
            return wrongAnswers;
        }
        return new HashSet<>();
    }

    private record GuessingRound(String image, List<String> choices, Set<String> correctAnswers, String note) {}
}

record RadcliffGame(String id, String title, String genre, String about, String image) {}