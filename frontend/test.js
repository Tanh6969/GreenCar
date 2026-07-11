const { Client } = require('pg');

async function test() {
  const client = new Client({
    connectionString: "postgres://postgres:postgres@localhost:5432/greencar?sslmode=disable"
  });
  await client.connect();
  
  const res = await client.query(`
    SELECT b.booking_id, u.name, u.email, u.license_no,
    (SELECT COUNT(*) FROM bookings cb WHERE cb.user_id = b.user_id AND cb.status IN ('completed','pending_payment','paid')) AS customer_trip_count
    FROM bookings b LEFT JOIN users u ON u.user_id = b.user_id 
    ORDER BY b.booking_id DESC LIMIT 5
  `);
  console.log(res.rows);
  await client.end();
}

test().catch(console.error);
