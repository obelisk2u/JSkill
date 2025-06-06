package main

import (
	"log"
	"net/http"
)

func main() {
	initPlayers(1000)

	http.HandleFunc("/simulate", simulateStepHandler)
	http.HandleFunc("/reset", resetHandler)
	log.Println("Running on :8080")
	http.ListenAndServe(":8080", withCORS(http.DefaultServeMux))
}

