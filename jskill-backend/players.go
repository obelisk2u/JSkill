package main

import (
	"math/rand"
	"github.com/obelisk2u/jskillbackend/trueskill"
)

var players []*trueskill.Player

func initPlayers(n int) { 
	players = make([]*trueskill.Player, n)
	for i := 0; i < n; i++ {
		trueRating := rand.Float64()*1500 + 750 
		players[i] = &trueskill.Player{
			ID:        i + 1,
			Mu:        1500.0,
			Sigma:     300.0,
			TrueRanking: trueRating,
			Elo:       1500,
		}
	}
}
