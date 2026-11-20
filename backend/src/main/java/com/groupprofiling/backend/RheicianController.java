package com.groupprofiling.backend;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/portfolio/rheician")
public class RheicianController {
    private static final String SESSION_KEY = "undasdanas.revision4";
    private static final Set<String> FOLDERS = Set.of(
            "yearner", "developer", "overthinker", "dramatic", "survivor");
    private static final int TOTAL_TILES = 16;
    private static final int RECORD_COUNT = 4;
    private static final int THREAT_LIMIT = 5;

    @GetMapping
    public String portfolio(@RequestParam(required = false) Boolean sent, Model model) {
        model.addAttribute("sent", Boolean.TRUE.equals(sent));
        return "rheician";
    }

    @GetMapping(value = "/game/status", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse status(HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            return response(game, true, false, "Session connected.");
        }
    }

    @PostMapping(value = "/game/enter", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse enter(HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            game.entered = true;
            return response(game, true, false,
                    "The endless fall is over. The memories have been waiting.");
        }
    }

    @PostMapping(value = "/game/folder", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse openFolder(@RequestParam String id, HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            if (!game.entered || !FOLDERS.contains(id)) {
                return response(game, false, false, "That folder is not available.");
            }
            game.openFolders.add(id);
            return response(game, true, false,
                    game.openFolders.size() == FOLDERS.size()
                            ? "All five memories inspected. The archive exit is now unlocked."
                            : "Memory inspected: " + game.openFolders.size() + " of 5.");
        }
    }

    @PostMapping(value = "/game/tile", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse inspectTile(@RequestParam int tile, HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            if (level(game) != 2) {
                return response(game, false, false, "The Academic Backrooms are not active.");
            }
            if (tile < 0 || tile >= TOTAL_TILES || game.foundTiles.contains(tile)
                    || game.wrongTiles.contains(tile)) {
                return response(game, false, false, "That panel cannot be opened again.");
            }
            if (game.recordTiles.contains(tile)) {
                game.foundTiles.add(tile);
                game.threat = Math.max(0, game.threat - 1);
                return response(game, true, false,
                        game.foundTiles.size() == RECORD_COUNT
                                ? "All academic records found. The next exit is unlocked."
                                : "Academic record recovered. Mr. Deadline steps back.");
            }
            game.wrongTiles.add(tile);
            return advanceThreat(game, "Wrong panel. Mr. Deadline is getting closer.");
        }
    }

    @PostMapping(value = "/game/tick", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse tick(HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            if (level(game) != 2) {
                return response(game, false, false, "The monster is currently inactive.");
            }
            return advanceThreat(game, "Footsteps detected. The deadline approaches.");
        }
    }

    @PostMapping(value = "/game/code", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse checkJava(@RequestParam String outputClass,
                                  @RequestParam String outputMethod,
                                  HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            if (level(game) != 3) {
                return response(game, false, false, "Recover the school records first.");
            }
            game.codeAttempts++;
            if ("System".equals(outputClass.trim()) && "println".equals(outputMethod.trim())) {
                game.codeSolved = true;
                return response(game, true, false,
                        "BUILD SUCCESSFUL. Java accepted your answers. Final exit unlocked.");
            }
            return response(game, false, false,
                    "BUILD FAILED. Hint: Java is case-sensitive. Think console output and a line break.");
        }
    }

    @PostMapping(value = "/game/escape", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse escape(HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            if (level(game) != 4) {
                return response(game, false, false, "Complete the Java challenge first.");
            }
            game.escaped = true;
            return response(game, true, false,
                    "Achievement unlocked: Certified Pastrooms Survivor.");
        }
    }

    @PostMapping(value = "/game/breakdown", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse breakdown(HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            game.breakdowns++;
            return response(game, true, false,
                    "SYSTEM WARNING: Emotional breakdown #" + game.breakdowns + " logged in Java.");
        }
    }

    @PostMapping(value = "/game/reset", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GameResponse reset(HttpSession session) {
        GameState game = game(session);
        synchronized (game) {
            game.entered = false;
            game.openFolders.clear();
            game.foundTiles.clear();
            game.wrongTiles.clear();
            game.randomizeTiles();
            game.threat = 0;
            game.catches = 0;
            game.codeAttempts = 0;
            game.codeSolved = false;
            game.escaped = false;
            game.breakdowns = 0;
            return response(game, true, false, "New run started. The past has respawned.");
        }
    }

    private GameResponse advanceThreat(GameState game, String message) {
        game.threat++;
        if (game.threat >= THREAT_LIMIT) {
            game.foundTiles.clear();
            game.wrongTiles.clear();
            game.randomizeTiles();
            game.threat = 0;
            game.catches++;
            return response(game, false, true,
                    "CAUGHT BY MR. DEADLINE. Academic panels reshuffled; your memories remain saved.");
        }
        return response(game, false, false, message);
    }

    private int level(GameState game) {
        if (!game.entered) return 0;
        if (game.openFolders.size() < FOLDERS.size()) return 1;
        if (game.foundTiles.size() < RECORD_COUNT) return 2;
        if (!game.codeSolved) return 3;
        return 4;
    }

    private GameResponse response(GameState game, boolean success, boolean caught, String message) {
        return new GameResponse(success, caught, message, level(game), game.entered,
                new ArrayList<>(game.openFolders),
                new ArrayList<>(game.foundTiles),
                new ArrayList<>(game.wrongTiles),
                new ArrayList<>(game.recordTiles),
                game.threat, game.catches, game.codeSolved, game.codeAttempts,
                game.escaped, game.breakdowns);
    }

    private GameState game(HttpSession session) {
        synchronized (session) {
            Object value = session.getAttribute(SESSION_KEY);
            if (value instanceof GameState state) return state;
            GameState state = new GameState();
            session.setAttribute(SESSION_KEY, state);
            return state;
        }
    }

    private static final class GameState implements Serializable {
        private static final long serialVersionUID = 5L;
        boolean entered;
        final LinkedHashSet<String> openFolders = new LinkedHashSet<>();
        final LinkedHashSet<Integer> foundTiles = new LinkedHashSet<>();
        final LinkedHashSet<Integer> wrongTiles = new LinkedHashSet<>();
        final LinkedHashSet<Integer> recordTiles = new LinkedHashSet<>();
        int threat;
        int catches;
        boolean codeSolved;
        int codeAttempts;
        boolean escaped;
        int breakdowns;

        GameState() {
            randomizeTiles();
        }

        void randomizeTiles() {
            recordTiles.clear();
            List<Integer> pool = new ArrayList<>();
            for (int i = 0; i < TOTAL_TILES; i++) pool.add(i);
            Collections.shuffle(pool);
            recordTiles.addAll(pool.subList(0, RECORD_COUNT));
        }
    }

    public record GameResponse(boolean success, boolean caught, String message, int level,
                               boolean entered, List<String> folders, List<Integer> tiles,
                               List<Integer> wrongTiles, List<Integer> glintTiles,
                               int threat, int catches, boolean codeSolved,
                               int codeAttempts, boolean escaped, int breakdowns) {}
}