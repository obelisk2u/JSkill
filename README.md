# 🧠 TrueSkill Simulation Playground

This project is a full-stack application that simulates TrueSkill-based matchmaking and rating evolution for a population of players. It features:

- A Go backend that updates ratings using the TrueSkill algorithm with expectation propegation.
- A React + Vite + Tailwind + ShadCN UI frontend that visualizes player ratings and convergence.
- A histogram chart showing rating distribution over time.
- Adjustable simulation loop count and reset functionality.

## 🗂 Project Structure

```
jskill-backend/
├── main.go           # Starts the HTTP server
├── api.go            # Simulation and reset endpoints
├── players.go        # Player struct and initialization
├── trueskill/
│   └── trueskill.go  # Custom TrueSkill update logic

jskill-frontend/
├── src/
│   ├── App.tsx             # Main frontend logic
│   ├── components/
│   │   └── HistogramCard.tsx # Histogram chart using react-chartjs-2
│   └── ... (ShadCN components)
```

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/jskill.git
cd jskill
```

### 2. Run the Backend

```bash
cd jskill-backend
go run .
```

Runs on `http://localhost:8080`

### 3. Run the Frontend

```bash
cd jskill-frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## 🔢 Features

- **Simulate Matches**: Click "Simulate Match" to run one or more loops of 1v1 games.
- **TrueSkill Updates**: Ratings are updated using performance-based probabilistic inference.
- **Visualize Convergence**: Histogram shows how player ratings evolve over time.
- **Sorting**: Table can be sorted by player ID, rating (μ), or true skill.
- **Adjustable Loops**: Input the number of simulation loops to run per step.
- **Skill Update Type**: Change the skill updating algorithm (Elo/TrueSkill)
- **Reset**: Clear and restart all ratings.

## 📊 Math & Modeling

- Ratings follow a simplified version of the TrueSkill algorithm, using Gaussian assumptions.
- Sigma (uncertainty) is updated per match and floored (0.2) to prevent overconfidence.
- Players are matched with opponents of similar current skill to accelerate convergence.

## 📦 Dependencies

**Frontend**

- React + Vite
- Tailwind CSS + ShadCN UI
- react-chartjs-2 + Chart.js

**Backend**

- Go 1.20+
- Standard library only

## 📝 License

MIT License. Use freely for educational or research purposes.
