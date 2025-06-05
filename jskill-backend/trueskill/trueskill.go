package trueskill

import "math"

type Player struct {
	ID            int     `json:"id"`
	Mu            float64 `json:"mu"`
	Sigma         float64 `json:"sigma"`
	TrueSkill     float64 `json:"trueSkill"`
	MatchesPlayed int     `json:"matchesPlayed"`
}


// NewPlayer creates a player with default TrueSkill params (mu=1500, sigma=500)
func NewPlayer(id int, trueSkill float64) Player {
	return Player{
		ID:        id,
		Mu:        1500,
		Sigma:     500,
		TrueSkill: trueSkill,
	}
}

// UpdateSkills performs a simple TrueSkill-like update
func UpdateSkills(p1, p2 *Player, p1Wins bool, beta float64) {
	c := math.Sqrt(2*beta*beta + p1.Sigma*p1.Sigma + p2.Sigma*p2.Sigma)

	// Compute expected score
	t := (p1.Mu - p2.Mu) / c
	expectedP1 := 1.0 / (1.0 + math.Exp(-t))

	// Actual outcome
	var score float64
	if p1Wins {
		score = 1.0
	} else {
		score = 0.0
	}

	// Learning rate adjustment
	k := 32.0 / c

	// Update means
	p1.Mu += k * (score - expectedP1)
	p2.Mu += k * ((1 - score) - (1 - expectedP1))

	// Decay uncertainty
	p1.Sigma *= 0.95
	p2.Sigma *= 0.95
}
