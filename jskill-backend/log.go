package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
)

func logPlayersToCSV(filename string, step int) error {
	file, err := os.OpenFile(filename, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header only on the first step
	if step == 0 {
		writer.Write([]string{"step", "id", "mu", "sigma", "true_skill", "matches_played"})
	}

	for _, p := range players {
		record := []string{
			strconv.Itoa(step),
			strconv.Itoa(p.ID),
			fmt.Sprintf("%.2f", p.Mu),
			fmt.Sprintf("%.2f", p.Sigma),
			fmt.Sprintf("%.2f", p.TrueRanking),
		}
		writer.Write(record)
	}

	return nil
}
