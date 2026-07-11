package service

import (
	"fmt"
	"net/smtp"
	"os"
)

type EmailService struct {
	host string
	port string
	user string
	pass string
}

func NewEmailService() *EmailService {
	return &EmailService{
		host: os.Getenv("MAIL_HOST"),
		port: os.Getenv("MAIL_PORT"),
		user: os.Getenv("MAIL_USER"),
		pass: os.Getenv("MAIL_PASS"),
	}
}

func (s *EmailService) SendPasswordResetEmail(toEmail, resetLink string) error {
	if s.host == "" || s.port == "" || s.user == "" || s.pass == "" {
		return fmt.Errorf("SMTP configuration is incomplete")
	}

	auth := smtp.PlainAuth("", s.user, s.pass, s.host)

	from := fmt.Sprintf("GreenCar <%s>", s.user)
	subject := "Subject: Yêu cầu khôi phục mật khẩu GreenCar\r\n"
	headers := fmt.Sprintf("From: %s\r\nTo: %s\r\n%s", from, toEmail, subject)
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"

	body := fmt.Sprintf(`
		<html>
		<head><meta charset="utf-8"></head>
		<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
			<div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
				<h2 style="color: #006C4C; text-align: center;">GreenCar - Khôi phục mật khẩu</h2>
				<p>Chào bạn,</p>
				<p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với email này.</p>
				<p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu mới. Link này sẽ hết hạn sau 15 phút.</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="%s" style="background-color: #006C4C; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
						Đặt Lại Mật Khẩu
					</a>
				</div>
				<p style="color: #666; font-size: 14px;">Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
				<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
				<p style="color: #999; font-size: 12px; text-align: center;">© 2026 GreenCar. All rights reserved.</p>
			</div>
		</body>
		</html>
	`, resetLink)

	msg := []byte(headers + mime + body)

	addr := fmt.Sprintf("%s:%s", s.host, s.port)
	return smtp.SendMail(addr, auth, s.user, []string{toEmail}, msg)
}
