package trueskill

import "math"

type Player struct {
	ID            int     `json:"id"`
	Mu            float64 `json:"mu"`
	Sigma         float64 `json:"sigma"`
	TrueRanking     float64 `json:"trueSkill"`
	Elo           float64 `json:"elo"`
}

func phi(x float64) float64 {
	return math.Exp(-0.5*x*x) / math.Sqrt(2*math.Pi)
}

func Phi(x float64) float64 {
	return 0.5 * (1 + math.Erf(x/math.Sqrt2))
}

func EPUpdate(p1, p2 *Player, p1Wins bool, beta float64) {
	mu1, mu2 := p1.Mu, p2.Mu
	sig1, sig2 := p1.Sigma, p2.Sigma

	cSquared := sig1*sig1 + sig2*sig2 + 2*beta*beta
	c := math.Sqrt(cSquared)

	// If p2 wins, flip the direction of the performance difference
	delta := mu1 - mu2
	if !p1Wins {
		delta = -delta
	}

	t := delta / c
	v := phi(t) / Phi(t)
	w := v * (v + t)

	// Mean updates
	mu1Delta := (sig1 * sig1 / c) * v
	mu2Delta := (sig2 * sig2 / c) * v

	if p1Wins {
		mu1 += mu1Delta
		mu2 -= mu2Delta
	} else {
		mu1 -= mu1Delta
		mu2 += mu2Delta
	}

	// Variance updates
	sig1Squared := sig1 * sig1 * (1 - (sig1 * sig1 / cSquared) * w)
	sig2Squared := sig2 * sig2 * (1 - (sig2 * sig2 / cSquared) * w)

	// Floor enforcement
	const sigmaFloor = 50.0
	sig1New := math.Sqrt(math.Max(sig1Squared, sigmaFloor*sigmaFloor))
	sig2New := math.Sqrt(math.Max(sig2Squared, sigmaFloor*sigmaFloor))

	p1.Mu = mu1
	p1.Sigma = sig1New
	p2.Mu = mu2
	p2.Sigma = sig2New
}

func EloUpdate(p1, p2 *Player, p1Wins bool, k float64) {
	// Compute expected scores
	r1 := math.Pow(10, p1.TrueRanking/400)
	r2 := math.Pow(10, p2.TrueRanking/400)

	e1 := r1 / (r1 + r2)
	e2 := r2 / (r1 + r2)

	// Actual scores
	var s1, s2 float64
	if p1Wins {
		s1, s2 = 1.0, 0.0
	} else {
		s1, s2 = 0.0, 1.0
	}

	// Update ratings
	p1.Elo += k * (s1 - e1)
	p2.Elo += k * (s2 - e2)
}

