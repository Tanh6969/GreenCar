package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	dsn := "host=localhost port=5432 user=postgres password=Megake123 dbname=greencar sslmode=disable"
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Insert categories if not exist
	_, err = db.Exec(`
		INSERT INTO blog_categories (name, slug) 
		VALUES 
			('Kinh nghiệm', 'kinh-nghiem'),
			('Tin tức', 'tin-tuc')
		ON CONFLICT DO NOTHING;
	`)
	if err != nil {
		log.Println("category insert error:", err)
	}

	// Insert blog posts
	query := `
	INSERT INTO blog_posts (user_id, category_id, title, slug, excerpt, content, cover_image, status, published_at, created_at, updated_at) 
	VALUES 
	(
		(SELECT user_id FROM users LIMIT 1), 
		(SELECT category_id FROM blog_categories WHERE slug='kinh-nghiem' LIMIT 1), 
		'Top 5 xe điện đáng trải nghiệm nhất năm 2026', 
		'top-5-xe-dien-2026', 
		'Cùng khám phá những dòng xe điện đang làm mưa làm gió trên thị trường và tìm ra chiếc xe phù hợp nhất với bạn.', 
		'<p>Năm 2026 chứng kiến sự bùng nổ của nhiều dòng xe điện mới với công nghệ hiện đại. Dưới đây là 5 mẫu xe nổi bật nhất:</p><h3>1. VinFast VF 9</h3><p>Đại diện đến từ Việt Nam với thiết kế bề thế, rộng rãi và tầm hoạt động ấn tượng.</p><h3>2. Tesla Model Y</h3><p>Mẫu SUV điện bán chạy nhất toàn cầu, cân bằng hoàn hảo giữa hiệu năng và tính thực dụng.</p><h3>3. Lucid Air</h3><p>Chiếc xe mang đến trải nghiệm sedan hạng sang đích thực với phạm vi di chuyển hơn 800km.</p><h3>4. Rivian R1S</h3><p>Sự lựa chọn số một cho các chuyến dã ngoại nhờ khả năng off-road vượt trội.</p><h3>5. Hyundai Ioniq 6</h3><p>Sở hữu thiết kế khí động học ấn tượng và tốc độ sạc siêu nhanh.</p>', 
		'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
		'published', 
		NOW(), NOW(), NOW()
	),
	(
		(SELECT user_id FROM users LIMIT 1), 
		(SELECT category_id FROM blog_categories WHERE slug='kinh-nghiem' LIMIT 1), 
		'Kinh nghiệm thuê xe tự lái cho người mới', 
		'kinh-nghiem-thue-xe-tu-lai', 
		'Những điều cần đặc biệt lưu ý khi lần đầu tiên thuê xe tự lái để có một chuyến đi an toàn và trọn vẹn.', 
		'<p>Thuê xe tự lái mang lại sự chủ động tuyệt đối cho chuyến đi của bạn. Tuy nhiên, nếu là người mới, bạn cần nắm rõ một số kinh nghiệm sau:</p><h3>1. Kiểm tra xe kỹ lưỡng</h3><p>Trước khi nhận xe, hãy quay video hoặc chụp ảnh lại toàn bộ ngoại thất, nội thất xe, bao gồm cả những vết xước có sẵn để đối chiếu khi trả xe.</p><h3>2. Đọc kỹ hợp đồng</h3><p>Lưu ý các điều khoản về giới hạn số km, phụ phí quá giờ, và các quy định bồi thường trong trường hợp xảy ra sự cố.</p><h3>3. Làm quen với xe</h3><p>Dành ra 5-10 phút để làm quen với các tính năng trên xe, đặc biệt là cách sử dụng hệ thống sạc nếu bạn thuê xe điện.</p>', 
		'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
		'published', 
		NOW(), NOW(), NOW()
	),
	(
		(SELECT user_id FROM users LIMIT 1), 
		(SELECT category_id FROM blog_categories WHERE slug='tin-tuc' LIMIT 1), 
		'GreenCar chính thức mở rộng dịch vụ tại Đà Nẵng', 
		'greencar-mo-rong-da-nang', 
		'Tin vui cho các tín đồ xe điện tại miền Trung, GreenCar đã chính thức có mặt tại thành phố đáng sống nhất Việt Nam.', 
		'<p>Sau thời gian dài chuẩn bị, GreenCar tự hào thông báo ra mắt dịch vụ thuê xe điện tự lái tại Đà Nẵng.</p><p>Khách hàng tại Đà Nẵng và các tỉnh lân cận giờ đây có thể dễ dàng trải nghiệm các dòng xe điện đẳng cấp từ VinFast, Tesla đến Audi thông qua nền tảng GreenCar.</p><p>Nhân dịp khai trương, GreenCar dành tặng mã giảm giá <strong>DANANG20</strong> (giảm 20% giá thuê) cho 100 khách hàng đầu tiên đặt xe tại Đà Nẵng.</p>', 
		'https://images.unsplash.com/photo-1555060855-726e6f987258?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
		'published', 
		NOW(), NOW(), NOW()
	),
	(
		(SELECT user_id FROM users LIMIT 1), 
		(SELECT category_id FROM blog_categories WHERE slug='kinh-nghiem' LIMIT 1), 
		'Hướng dẫn sạc pin xe điện đúng cách', 
		'huong-dan-sac-pin-xe-dien', 
		'Bảo vệ tuổi thọ pin xe điện của bạn với những mẹo đơn giản nhưng cực kỳ hiệu quả.', 
		'<p>Pin là trái tim của một chiếc xe điện. Việc sạc pin đúng cách không chỉ đảm bảo an toàn mà còn giúp kéo dài tuổi thọ của pin.</p><h3>1. Tránh để pin cạn kiệt</h3><p>Không nên để pin xuống dưới 20% thường xuyên. Tốt nhất là sạc xe khi pin còn khoảng 30%.</p><h3>2. Giới hạn mức sạc</h3><p>Với các chuyến đi lại trong đô thị hàng ngày, bạn chỉ nên sạc pin đến 80%. Chỉ sạc đầy 100% khi chuẩn bị cho những hành trình dài.</p><h3>3. Hạn chế sạc nhanh</h3><p>Các trụ sạc siêu nhanh (DC) sinh ra nhiều nhiệt và có thể làm giảm tuổi thọ pin nếu sử dụng liên tục. Hãy ưu tiên sạc chậm (AC) tại nhà qua đêm khi có thể.</p>', 
		'https://images.unsplash.com/photo-1620803450989-10ee597811ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
		'published', 
		NOW(), NOW(), NOW()
	);`

	_, err = db.Exec(query)
	if err != nil {
		log.Println("Insert error (maybe duplicate slug?):", err)
	} else {
		fmt.Println("Seeded 4 blog posts successfully!")
	}
}
