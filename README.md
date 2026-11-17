# ROLBOX — AET Group 4 Profiling System

A multi-member profiling web application built with **Java Spring Boot MVC** and **Thymeleaf**, featuring a shared dashboard and four modular member portfolios.

## Group 4 Members
* **Rheician Jhoy B. Gonzales** — `/portfolio/rheician` (`RheicianController.java`)
* **Chelsy Kaye C. Ilagan** — `/portfolio/chelsy` (`ChelsyController.java`)
* **Jahn Olivenn Esmarin** — `/portfolio/olivenn` (`OlivennController.java`)
* **Radcliff Jorel B. Flores** — `/portfolio/radcliff` (`RadcliffController.java`)

---

## System Architecture

The backend follows a modular **Spring Boot MVC** pattern where each teammate owns an isolated Java `@Controller` class to eliminate Git merge conflicts and adhere to the Single Responsibility Principle:

```text
backend/
└── src/main/
    ├── java/com/groupprofiling/backend/
    │   ├── BackendApplication.java      # Spring Boot entry point
    │   ├── ProfilingController.java     # Shared dashboard (/), feedback POST/DELETE
    │   ├── RheicianController.java      # Rheician's portfolio & interaction counter
    │   ├── ChelsyController.java        # Chelsy's portfolio & interaction counter
    │   ├── OlivennController.java       # Olivenn's portfolio & interaction counter
    │   └── RadcliffController.java      # Radcliff's portfolio & interaction counter
    └── resources/
        ├── static/
        │   ├── images/                  # Static profile & game card assets
        │   └── sounds/                  # Dashboard sound effects
        └── templates/
            ├── home.html                # Main ROLBOX dashboard & alerts wall
            ├── rheician.html            # Rheician's portfolio view
            ├── chelsy.html              # Chelsy's portfolio view
            ├── olivenn.html             # Olivenn's portfolio view
            └── radcliff.html            # Radcliff's portfolio view