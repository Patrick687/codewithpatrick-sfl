# codewithpatrick-sfl

## Iteration 1 - Minimal Viable Product (MVP)

### FUNCTIONAL GOALS

✅ 1. Authentication Register

Login

Authenticated sessions using JWT (or cookies if preferred)

✅ 2. Leagues Create a league with a name and Survivor season

Owner role is automatically assigned

Generate a time-limited invite code (can be a simple UUID + timestamp)

Join a league using an invite code

Basic league member listing

Owner can:

Rename league

Delete league

Kick a member

Admin/member roles can be hardcoded or editable in future versions

✅ 3. Picks System (Initial Survey Only) A player can make initial picks for the
season

A player can view their picks

System can calculate points for those picks (this can be dummy data at first)

Skip episode-by-episode picks for now — just implement the pre-season
survey-based pick system for MVP.

✅ 4. Basic Game Logic Hardcode one season’s cast (or store it as seed data)

Calculate points based on a dummy rule (e.g. "get 1 point if your pick survives
each week")

Manual advancement of game state for now (no real-time updates)

### Non-Functional MVP Goals

PostgreSQL as DB (great relational fit)

NestJS (gives you modularity + DX speed)

Prisma (faster and more ergonomic than Sequelize — especially with NestJS)

JWT auth via middleware

Zod for input validation

Swagger docs + seeded dev DB

Dockerized dev environment (optional but useful)
