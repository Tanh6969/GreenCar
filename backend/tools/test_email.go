package main

import (
	"fmt"
	"os"
	"github.com/joho/godotenv"
	"greencar/internal/service"
)

func main() {
	godotenv.Load()
	
	emailSvc := service.NewEmailService()
	err := emailSvc.SendPasswordResetEmail("nguyenvanxuan01011961@gmail.com", "http://localhost:3000/auth/reset-password?token=test")
	if err != nil {
		fmt.Println("Error sending email:", err)
		os.Exit(1)
	}
	fmt.Println("Email sent successfully!")
}
