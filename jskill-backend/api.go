package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"time"
	"sort"
	"strconv"
)
import "github.com/obelisk2u/jskillbackend/trueskill"

var stepCount int = 0

func resetHandler(w http.ResponseWriter, r *http.Request) { 
	initPlayers(1000)    
	stepCount = 0    
	w.WriteHeader(http.StatusOK)
}

func simulateStepHandler(w http.ResponseWriter, r *http.Request) {
	const beta = 250
	loopCount := 1 // default
	if r.URL.Query().Has("loops") {
		if val, err := strconv.Atoi(r.URL.Query().Get("loops")); err == nil && val > 0 {
			loopCount = val
		}
	}

	updateType := r.URL.Query().Get("updateType")
	rand.Seed(time.Now().UnixNano())

	for l := 0; l < loopCount; l++ {
		// Sort players by mu
		sort.Slice(players, func(i, j int) bool {
			return players[i].Mu < players[j].Mu
		})

		// Shuffle within local blocks of 10 to reduce deterministic convergence
		for i := 0; i < len(players); i += 10 {
			end := i + 10
			if end > len(players) {
				end = len(players)
			}
			rand.Shuffle(end-i, func(j, k int) {
				players[i+j], players[i+k] = players[i+k], players[i+j]
			})
		}

		for i := 0; i < len(players)-1; i += 2 {
			p1 := players[i]
			p2 := players[i+1]

			p1Perf := p1.TrueRanking + rand.NormFloat64()*beta
			p2Perf := p2.TrueRanking + rand.NormFloat64()*beta
			p1Wins := p1Perf > p2Perf

			switch updateType {
				case "ELO":
					trueskill.EloUpdate(p1, p2, p1Wins, 32)
				default:
					trueskill.EPUpdate(p1, p2, p1Wins, beta)
				}

		}

		stepCount++
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}



