package main

import (
	"math/rand"
	"fmt"
	"github.com/obelisk2u/jskillbackend/trueskill"
)

var players []*trueskill.Player

func initPlayers(n int) {
	fmt.Println("Initializing players")  
	players = make([]*trueskill.Player, n)
	for i := 0; i < n; i++ {
		trueSkill := rand.Float64()*1500 + 750 
		players[i] = &trueskill.Player{
			ID:        i + 1,
			Mu:        1500.0,
			Sigma:     300.0,
			TrueSkill: trueSkill,
		}
	}
}
