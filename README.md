# ROLBOX — AET Group 4 Profiling System

A group profiling website developed for **AET Group 4** using **Java, Spring Boot MVC, Thymeleaf, Tailwind CSS, and JavaScript**. ROLBOX features a shared dashboard and four individual member portfolios, each with its own design and interactive features.

> **Current architecture:** This project uses Spring Boot MVC with server-rendered HTML. **React, JSX, Vite, and a separate `frontend/` folder are no longer required.**

## Group Members

| Member | Portfolio Route | Java Controller |
| --- | --- | --- |
| Rheician Jhoy B. Gonzales | `/portfolio/rheician` | `RheicianController.java` |
| Chelsy Kaye C. Ilagan | `/portfolio/chelsy` | `ChelsyController.java` |
| Jahn Olivenn Esmarin | `/portfolio/olivenn` | `OlivennController.java` |
| Radcliff Jorel B. Flores | `/portfolio/radcliff` | `RadcliffController.java` |

## Technologies Used

| Technology | Purpose |
| --- | --- |
| **Java 21** | Backend programming language |
| **Spring Boot 4.1.2 / Spring MVC** | Application startup, request routing, server-side functionality |
| **Thymeleaf** | Renders HTML templates using data supplied by Java controllers |
| **HTML + Tailwind CSS** | Page structure, responsive layout, and styling |
| **JavaScript + CSS animations** | Browser-side visual effects, sound playback, and immediate interactions |
| **Gradle** | Dependency management and building/running the Spring Boot project |

**How the components work together:** A browser requests a page, a Spring MVC controller processes the request and passes data to a Thymeleaf template, and Spring Boot serves the rendered HTML. For actions that change application data, forms or JavaScript send HTTP `POST` requests to Java controller methods. JavaScript is still allowed for frontend effects; it does not replace Spring Boot for backend processing.

## Project Folder Structure

```text
group-profiling/
├── README.md
└── backend/
    ├── build.gradle
    ├── gradlew
    ├── gradlew.bat
    ├── gradle/wrapper/
    └── src/main/
        ├── java/com/groupprofiling/backend/
        │   ├── BackendApplication.java      # Spring Boot entry point
        │   ├── ProfilingController.java     # Homepage and feedback
        │   ├── RheicianController.java      # Rheician's portfolio and interactions
        │   ├── ChelsyController.java        # Chelsy's portfolio and interactions
        │   ├── OlivennController.java       # Olivenn's portfolio and interactions
        │   └── RadcliffController.java      # Radcliff's portfolio and interactions
        └── resources/
            ├── application.properties
            ├── templates/
            │   ├── home.html
            │   ├── rheician.html
            │   ├── chelsy.html
            │   ├── olivenn.html
            │   └── radcliff.html
            └── static/
                ├── images/                 # Photos and other image assets
                ├── sounds/
                │   └── fahh.mp3
                └── js/
                    ├── common.js          # Shared sound playback
                    ├── home.js            # Homepage interactions
                    ├── rheician.js        # Rheician's interactive effects
                    ├── chelsy.js          # Chelsy's interactive effects
                    └── lightfall.js       # Olivenn's animated background
```

> The JavaScript files above belong to the **restored-interactions update**. If they are missing from your working copy, copy the `static/js/` folder from the update ZIP as well as the corresponding updated HTML and Java controller files.

## Running the Application

### Prerequisites

- **JDK 21** installed and configured.
- **IntelliJ IDEA** or **VS Code** with Java support (recommended).
- Internet connection for first-time Gradle dependency downloads and CDN-loaded styles/fonts.

### Option A — Run from an IDE

1. Open the existing `group-profiling` project (or open its `backend` folder as a Gradle project).
2. Let the IDE import/sync Gradle dependencies.
3. Open `backend/src/main/java/com/groupprofiling/backend/BackendApplication.java`.
4. Click **Run** beside the `main()` method.
5. Visit **http://localhost:8080/**.

### Option B — Run with the Gradle wrapper

Open a terminal in the repository root and enter the backend directory:

```bash
cd backend
```

**Windows (PowerShell):**

```powershell
.\gradlew.bat bootRun
```

**macOS / Linux:**

```bash
./gradlew bootRun
```

Then open **http://localhost:8080/**. Stop the running application using **Ctrl+C** in the terminal (or the IDE's Stop button).

**You only need to use one run method.** If the IDE's Run button starts Spring Boot successfully, typing the Gradle command separately is unnecessary. There is no need to run `npm install` or `npm run dev`.

## Features and Routes

| Route | Method | Function |
| --- | --- | --- |
| `/` | `GET` | Shared ROLBOX dashboard, member cards, and feedback wall |
| `/portfolio/rheician` | `GET` | Rheician's portfolio and interactive archive |
| `/portfolio/rheician/interact` | `POST` | Record an emotional-breakdown interaction |
| `/portfolio/rheician/next-card` | `POST` | Advance the active archive card |
| `/portfolio/rheician/select-card` | `POST` | Save the selected archive card index |
| `/portfolio/chelsy` | `GET` | Chelsy's portfolio and interactive memes |
| `/portfolio/chelsy/interact` | `POST` | Increment the inulti counter |
| `/portfolio/olivenn` | `GET` | Olivenn's portfolio and animated background |
| `/portfolio/olivenn/interact` | `POST` | Increment the vouch counter |
| `/portfolio/radcliff` | `GET` | Radcliff's manga-inspired portfolio |
| `/portfolio/radcliff/interact` | `POST` | Increment the menacing counter |
| `/feedback` | `POST` | Submit a message from a member's portfolio |
| `/feedback/delete` | `POST` | Remove a message from the shared feedback wall |

**Frontend highlights:** The homepage includes a loading screen, welcome banner, and portfolio search; Rheician's page includes a loading/confirmation sequence and selectable archive cards; Chelsy's page includes a moving button and meme popups; Olivenn's page includes a Lightfall background; and Radcliff's page uses an animated manga-style layout.

## Guide for Group Members

To modify your own portfolio, update the corresponding files:

1. **HTML / Thymeleaf:** `backend/src/main/resources/templates/<member>.html` — page content and Tailwind styling.
2. **Java controller:** `backend/src/main/java/com/groupprofiling/backend/<Member>Controller.java` — routes, request handling, and backend state.
3. **JavaScript:** `backend/src/main/resources/static/js/` — browser-side interactions and animation logic (if needed).
4. **Images / sound:** Put files in `backend/src/main/resources/static/images/` or `static/sounds/` and reference them with URLs such as `/images/photo.jpg` or `/sounds/fahh.mp3`.

Use `th:text`, `th:each`, `th:if`, and related Thymeleaf expressions when displaying values supplied by a controller. When an interaction must update the server, use an appropriate Spring `@PostMapping` route instead of relying only on a local JavaScript variable.

**Collaboration:** Avoid editing another member's controller or template without coordinating. Shared changes, such as the dashboard and common JavaScript, should be reviewed together.

## GitHub Workflow

Run Git commands from the **repository root** (`group-profiling/`), not from an extracted update ZIP.

```bash
git status
git pull origin main
```

Before pulling, **commit or stash any uncommitted changes** to avoid accidentally mixing work. Only pull `main` after the intended changes have been merged there. For your own work, create a branch if your group is using pull requests:

```bash
git switch -c feature/my-portfolio-update
# Edit and test your files.
git add backend/src/main/java/com/groupprofiling/backend/YourController.java backend/src/main/resources/templates/yourpage.html
git commit -m "Update my portfolio"
git push -u origin feature/my-portfolio-update
```

Replace the example filenames with your actual files. Add relevant files from `static/js/`, `static/images/`, or `static/sounds/` if you changed them. Review `git status` before committing to avoid including generated `build/`, `.gradle/`, or personal IDE files.

## Important Notes

- **No database is configured.** Feedback, counters, and the active archive card are held in server memory and reset when the Spring Boot application restarts. They are shared across visitors while the server is running.
- **Client-side effects and server-side data are different.** JavaScript/CSS handles the immediate visuals; Java controllers process routes and recorded interactions.
- **Some assets are loaded online.** Tailwind CSS, Google Fonts, or remote images may need an internet connection; local images and `fahh.mp3` are served by Spring Boot.
- **Academic/demo scope:** The shared feedback wall is not an authenticated messaging system. Do not submit sensitive personal information.

---

**AET Group 4 · ROLBOX Profiling System · 2026**
