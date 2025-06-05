package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"time"
	"fmt"
)
import "github.com/obelisk2u/jskillbackend/trueskill"

var stepCount int = 0

func resetHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Resetting")  
	initPlayers(100)    
	stepCount = 0    
	w.WriteHeader(http.StatusOK)
}

func simulateStepHandler(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().UnixNano())

	rand.Shuffle(len(players), func(i, j int) {
		players[i], players[j] = players[j], players[i]
	})

	for i := 0; i < len(players)-1; i += 2 {
		p1 := players[i]
		p2 := players[i+1]

		p1Score := p1.TrueSkill + rand.NormFloat64()*100
		p2Score := p2.TrueSkill + rand.NormFloat64()*100
		p1Wins := p1Score > p2Score

		trueskill.UpdateSkills(p1, p2, p1Wins, 100.0)
	}

	// Log to CSV
	// logPlayersToCSV("player_log.csv", stepCount)
	stepCount++

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}
