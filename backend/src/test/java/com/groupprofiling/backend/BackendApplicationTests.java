package com.groupprofiling.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void contextLoads() {
    }

    @Test
    void shootingSteelBallShowsVictoryAndUnlocksItsPanel() throws Exception {
        MockHttpSession session = new MockHttpSession();
        String initialProfile = mockMvc.perform(get("/portfolio/radcliff").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertEquals(3, initialProfile.split("class=\"game-panel-lock\"", -1).length - 1);

        mockMvc.perform(get("/portfolio/radcliff/games/steel-ball").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("FunnyValentine.png")));

        mockMvc.perform(post("/portfolio/radcliff/games/steel-ball/shoot").session(session))
                .andExpect(status().is3xxRedirection());
        mockMvc.perform(get("/portfolio/radcliff/games/steel-ball").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("VICTORY")))
                .andExpect(content().string(containsString("Tusk_act_4_manga_panel.png")))
                .andExpect(content().string(containsString("Tusk_Act4_Barrage.png")));

        String unlockedProfile = mockMvc.perform(get("/portfolio/radcliff").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertEquals(2, unlockedProfile.split("class=\"game-panel-lock\"", -1).length - 1);
        assertFalse(unlockedProfile.contains("src=\"/images/Steel%20Ball.png\""));
        assertTrue(unlockedProfile.contains("Reserved and quiet, he keeps to himself."));
    }

    @Test
    void findingWonderOfUShowsBadEndingAndUnlocksItsPanel() throws Exception {
        MockHttpSession session = new MockHttpSession();
        mockMvc.perform(post("/portfolio/radcliff/games/wonder-of-u/find")
                        .session(session)
                        .param("cell", "25"))
                .andExpect(status().isBadRequest());

        String gamePage = mockMvc.perform(get("/portfolio/radcliff/games/wonder-of-u").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("WOU_1.png")))
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertFalse(gamePage.contains("Click WOU_1 in the 5 × 5 grid."));
        assertEquals(25, gamePage.split("class=\"grid-cell\"", -1).length - 1);

        Matcher targetCell = Pattern.compile(
                        "(?s)<button(?=[^>]*name=\"cell\")(?=[^>]*value=\"(\\d+)\")[^>]*>\\s*<img[^>]*src=\"/images/WOU_1.png\"")
                .matcher(gamePage);
        assertTrue(targetCell.find(), "WOU_1 must appear in one clickable grid cell");
        int targetValue = Integer.parseInt(targetCell.group(1));
        int wrongValue = (targetValue + 1) % 25;

        mockMvc.perform(post("/portfolio/radcliff/games/wonder-of-u/find")
                        .session(session)
                        .param("cell", Integer.toString(wrongValue)))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/portfolio/radcliff/games/wonder-of-u?miss=true"));
        mockMvc.perform(get("/portfolio/radcliff/games/wonder-of-u")
                        .session(session)
                        .param("miss", "true"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Not there. Try again.")));

        mockMvc.perform(post("/portfolio/radcliff/games/wonder-of-u/find")
                        .session(session)
                        .param("cell", Integer.toString(targetValue)))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/portfolio/radcliff/games/wonder-of-u"));
        mockMvc.perform(get("/portfolio/radcliff/games/wonder-of-u").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Bad Ending?")))
                .andExpect(content().string(containsString("WOU_BadEnd.png")));

        String unlockedProfile = mockMvc.perform(get("/portfolio/radcliff").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertEquals(2, unlockedProfile.split("class=\"game-panel-lock\"", -1).length - 1);
        assertFalse(unlockedProfile.contains("src=\"/images/Wonder_of_U_Manga.png\""));
        assertTrue(unlockedProfile.contains("He enjoys drawing, gaming, and imagining things."));
    }

    @Test
    void completingRohanGuessingGameRevealsFinalPanelAndProfilePicture() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("radcliffSteelBallUnlocked", true);
        session.setAttribute("radcliffWonderOfUUnlocked", true);
        String[] images = {
                "Josuke4.png", "Josuke8.png", "Kira1.png", "Kira2.png", "Kira3.png", "Kira4.png"
        };
        String[] answers = {
                "Josuke Higashikata", "Josuke Higashikata", "Yoshikage Kira",
                "Kosaku Kawajiri", "Yoshikage Kira", "Yoshikage Kira"
        };
        String[] notes = {
                null, "confusing.", null, "the same person",
                "the same person... again", "different people!"
        };

        String gamePage = loadRohanGame(session);
        assertTrue(gamePage.contains(images[0]));
        assertTrue(gamePage.contains("Johnny Joestar"));
        assertFalse(gamePage.contains("Johhny Joestar"));
        mockMvc.perform(post("/portfolio/radcliff/games/mystery/answer")
                        .session(session)
                        .param("answer", "Jotaro Kujo"))
                .andExpect(status().is3xxRedirection());
        gamePage = loadRohanGame(session);
        assertTrue(gamePage.contains("answer-wrong"));

        for (int round = 0; round < answers.length; round++) {
            mockMvc.perform(post("/portfolio/radcliff/games/mystery/answer")
                            .session(session)
                            .param("answer", answers[round]))
                    .andExpect(status().is3xxRedirection())
                    .andExpect(redirectedUrl("/portfolio/radcliff/games/mystery"));
            gamePage = loadRohanGame(session);
            assertTrue(gamePage.contains(images[round]));
            assertTrue(gamePage.contains("answer-correct"));
            if (notes[round] != null) {
                assertTrue(gamePage.contains(notes[round]), "Missing note on round " + (round + 1));
            }

            if (round < answers.length - 1) {
                assertTrue(gamePage.contains("Next Round"));
                mockMvc.perform(post("/portfolio/radcliff/games/mystery/next").session(session))
                        .andExpect(status().is3xxRedirection())
                        .andExpect(redirectedUrl("/portfolio/radcliff/games/mystery"));
            } else {
                assertTrue(gamePage.contains("Good job. I had already used Heaven's Door to read your memories btw"));
                assertTrue(gamePage.contains("RETURN TO PROFILE"));
            }
        }

        String completedProfile = mockMvc.perform(get("/portfolio/radcliff").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertEquals(0, completedProfile.split("class=\"game-panel-lock\"", -1).length - 1);
        assertFalse(completedProfile.contains("Rohan_DagaKotowaru.png"));
        assertFalse(completedProfile.contains("Pigeon.png"));
        assertTrue(completedProfile.contains("aria-label=\"Radcliff profile picture\""));
        assertTrue(completedProfile.contains("He dreams of creating original works. How whimsical."));
    }

    private String loadRohanGame(MockHttpSession session) throws Exception {
        return mockMvc.perform(get("/portfolio/radcliff/games/mystery").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Who is this?")))
                .andReturn()
                .getResponse()
                .getContentAsString();
    }
}
