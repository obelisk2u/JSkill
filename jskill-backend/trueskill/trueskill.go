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
func phi(x float64) float64 {
	return math.Exp(-0.5*x*x) / math.Sqrt(2*math.Pi)
}

// standard normal CDF (using erf)
func Phi(x float64) float64 {
	return 0.5 * (1 + math.Erf(x/math.Sqrt2))
}

func UpdateSkills(p1, p2 *Player, p1Wins bool, beta float64) {
	// Performance variance
	c := math.Sqrt(2*beta*beta + p1.Sigma*p1.Sigma + p2.Sigma*p2.Sigma)

	// Mean difference
	deltaMu := p1.Mu - p2.Mu
	if !p1Wins {
		deltaMu = -deltaMu
	}

	// Normalized difference
	t := deltaMu / c
	v := phi(t) / Phi(t)
	w := v * (v + t)

	// Update means

	mu1 := p1.Mu + (p1.Sigma*p1.Sigma/c)*v
	mu2 := p2.Mu - (p2.Sigma*p2.Sigma/c)*v
	if !p1Wins {
		mu1, mu2 = mu2, mu1 // swap back if p2 won
	}

	const minMu = 0.0
	const maxMu = 5000.0

	p1.Mu = math.Max(minMu, math.Min(mu1, maxMu))
	p2.Mu = math.Max(minMu, math.Min(mu2, maxMu))


	// Update sigmas with floor enforcement
	const sigmaFloor = 50.0
	newSigma1 := math.Sqrt(p1.Sigma*p1.Sigma * (1 - (p1.Sigma*p1.Sigma / (c * c)) * w))
	newSigma2 := math.Sqrt(p2.Sigma*p2.Sigma * (1 - (p2.Sigma*p2.Sigma / (c * c)) * w))

	// Enforce sigma floor
	if newSigma1 < sigmaFloor {
		newSigma1 = sigmaFloor
	}
	if newSigma2 < sigmaFloor {
		newSigma2 = sigmaFloor
	}

	p1.Sigma = newSigma1
	p2.Sigma = newSigma2

}
