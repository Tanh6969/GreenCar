/**
 * Mock API – dùng khi REACT_APP_USE_MOCK=true (demo không cần backend)
 * Tất cả state đặt trong biến module-level nên mutations tồn tại trong cùng 1 session.
 */

import { User } from "../types/user.type";
import {
  users as seedUsers,
  vehicles as seedVehicles,
  vehicleModels,
  vehicleImages,
  vehicleFeatures,
  vehicleModelFeatures,
  vehicleSpecs,
  locations,
  pricing,
  rentalPlans,
  bookings as seedBookings,
  blogPosts as seedBlogPosts,
  blogCategories,
} from "../data/mockData";

// ── Mutable in-memory stores ──────────────────────────────────────────────────

let _users    = [...seedUsers];
let _vehicles = [...seedVehicles];
let _bookings = [
  ...seedBookings,
  // Thêm nhiều booking phong phú hơn để dashboard đẹp hơn
  {
    booking_id: 2, user_id: 2, vehicle_id: 9,  rental_plan_id: 2,
    start_time: "2026-05-05T07:00:00Z", end_time: "2026-05-05T15:00:00Z",
    planned_km: 80, actual_km: 0, deposit_amount: 860000,
    overtime_fee: 0, over_km_fee: 0, total_price: 860000,
    status: "active", payment_method: "transfer", created_at: "2026-05-04T14:00:00Z",
  },
  {
    booking_id: 3, user_id: 3, vehicle_id: 14, rental_plan_id: 3,
    start_time: "2026-05-08T08:00:00Z", end_time: "2026-05-09T08:00:00Z",
    planned_km: 200, actual_km: 0, deposit_amount: 1500000,
    overtime_fee: 0, over_km_fee: 0, total_price: 1500000,
    status: "confirmed", payment_method: "transfer", created_at: "2026-05-07T09:00:00Z",
  },
  {
    booking_id: 4, user_id: 2, vehicle_id: 16, rental_plan_id: 3,
    start_time: "2026-04-10T08:00:00Z", end_time: "2026-04-11T08:00:00Z",
    planned_km: 150, actual_km: 140, deposit_amount: 2800000,
    overtime_fee: 0, over_km_fee: 0, total_price: 2800000,
    status: "completed", payment_method: "transfer", created_at: "2026-04-09T10:00:00Z",
  },
  {
    booking_id: 5, user_id: 3, vehicle_id: 19, rental_plan_id: 1,
    start_time: "2026-05-11T10:00:00Z", end_time: "2026-05-11T14:00:00Z",
    planned_km: 60, actual_km: 0, deposit_amount: 1800000,
    overtime_fee: 0, over_km_fee: 0, total_price: 1800000,
    status: "pending", payment_method: "cash", created_at: "2026-05-10T17:00:00Z",
  },
  {
    booking_id: 6, user_id: 2, vehicle_id: 5,  rental_plan_id: 2,
    start_time: "2026-03-20T09:00:00Z", end_time: "2026-03-20T17:00:00Z",
    planned_km: 100, actual_km: 95, deposit_amount: 820000,
    overtime_fee: 0, over_km_fee: 0, total_price: 820000,
    status: "completed", payment_method: "transfer", created_at: "2026-03-19T12:00:00Z",
  },
];

let _posts = seedBlogPosts.map(p => ({ ...p }));
let _nextPostId   = 6;
let _nextBookingId = 7;
let _nextVehicleId = 23;

// Mật khẩu mock (chỉ demo)
const PASSWORDS: Record<string, string> = {
  "admin@greencar.vn":    "admin123",
  "nguyenvana@gmail.com": "customer123",
  "tranthib@gmail.com":   "customer123",
};

// Token đơn giản (login cập nhật qua userFromToken)
let _currentUserId: number | null = null; // eslint-disable-line @typescript-eslint/no-unused-vars

// ── Helpers ──────────────────────────────────────────────────────────────────

const wait = (ms = 120) => new Promise(r => setTimeout(r, ms));

class MockApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Lấy user từ token (token = "mock_uid_X")
function userFromToken(token: string | null): User | null {
  if (!token) return null;
  const m = token.match(/^mock_uid_(\d+)$/);
  if (!m) return null;
  const uid = parseInt(m[1], 10);
  return _users.find(u => u.user_id === uid) ?? null;
}

function enrichBooking(b: typeof _bookings[0]) {
  const vehicle  = _vehicles.find(v => v.vehicle_id === b.vehicle_id);
  const model    = vehicle ? vehicleModels.find(m => m.vehicle_model_id === vehicle.vehicle_model_id) : null;
  const customer = _users.find(u => u.user_id === b.user_id);
  const plan     = rentalPlans.find(p => p.rental_plan_id === b.rental_plan_id);
  return {
    id:               b.booking_id,
    user_id:          b.user_id,
    vehicle_id:       b.vehicle_id,
    rental_plan_id:   b.rental_plan_id,
    start_time:       b.start_time,
    end_time:         b.end_time,
    planned_km:       b.planned_km,
    actual_km:        b.actual_km,
    deposit_amount:   b.deposit_amount,
    overtime_fee:     b.overtime_fee,
    over_km_fee:      b.over_km_fee,
    total_price:      b.total_price,
    status:           b.status,
    payment_method:   b.payment_method,
    created_at:       b.created_at,
    vehicle_brand:    model?.brand    ?? "",
    vehicle_name:     model?.name     ?? "",
    license_plate:    vehicle?.license_plate ?? "",
    plan_name:        plan?.name      ?? "",
    customer_name:    customer?.name  ?? "",
    customer_phone:   customer?.phone ?? "",
  };
}

function toApiPost(p: typeof _posts[0]) {
  const cat = p.category_id != null
    ? blogCategories.find(c => c.category_id === p.category_id)
    : null;
  return {
    post_id:      p.post_id,
    user_id:      p.user_id,
    category:     cat ? { category_id: cat.category_id, name: cat.name, slug: cat.slug } : null,
    title:        p.title,
    slug:         p.slug,
    excerpt:      p.excerpt,
    content:      p.content,
    cover_image:  p.cover_image,
    status:       p.status,
    reject_reason: (p as any).reject_reason ?? "",
    published_at: p.published_at,
    created_at:   p.created_at,
    updated_at:   p.updated_at,
  };
}

// ── Router ────────────────────────────────────────────────────────────────────

export async function mockApiCall<T>(
  path: string,
  method: string,
  body: unknown,
  token: string | null,
): Promise<T> {
  await wait();

  const authedUser = userFromToken(token);

  // POST /auth/login
  if (method === "POST" && path === "/auth/login") {
    const { email, password } = body as { email: string; password: string };
    const user = _users.find(u => u.email === email);
    if (!user || PASSWORDS[email] !== password) {
      throw new MockApiError(401, "Email hoặc mật khẩu không đúng.");
    }
    _currentUserId = user.user_id;
    return {
      access_token:  `mock_uid_${user.user_id}`,
      refresh_token: `mock_rf_${user.user_id}`,
      expires_at:    new Date(Date.now() + 86400000).toISOString(),
      role:          user.role_id === 1 ? "admin" : "customer",
      user_id:       user.user_id,
    } as T;
  }

  // POST /auth/register
  if (method === "POST" && path === "/auth/register") {
    const p = body as { name: string; email: string; password: string; phone: string; license_no: string };
    if (_users.find(u => u.email === p.email)) {
      throw new MockApiError(409, "Email đã được sử dụng.");
    }
    const newUser = {
      user_id:    _users.length + 1,
      name:       p.name,
      email:      p.email,
      phone:      p.phone,
      license_no: p.license_no,
      role_id:    2,
      created_at: new Date().toISOString(),
    };
    _users.push(newUser);
    PASSWORDS[p.email] = p.password;
    _currentUserId = newUser.user_id;
    return {
      access_token:  `mock_uid_${newUser.user_id}`,
      refresh_token: `mock_rf_${newUser.user_id}`,
      expires_at:    new Date(Date.now() + 86400000).toISOString(),
      role:          "customer",
      user_id:       newUser.user_id,
    } as T;
  }

  // GET /users/me
  if (method === "GET" && path === "/users/me") {
    const u = authedUser;
    if (!u) throw new MockApiError(401, "Chưa đăng nhập.");
    return { id: u.user_id, name: u.name, email: u.email, phone: u.phone, license_no: u.license_no, role_id: u.role_id, created_at: u.created_at } as T;
  }

  // GET /vehicles/cards
  if (method === "GET" && path === "/vehicles/cards") {
    const cards = _vehicles.map(v => {
      const model    = vehicleModels.find(m => m.vehicle_model_id === v.vehicle_model_id)!;
      const location = locations.find(l => l.location_id === v.location_id)!;
      const img      = vehicleImages.find(i => i.vehicle_model_id === v.vehicle_model_id);
      return {
        vehicle:   { id: v.vehicle_id, model_id: v.vehicle_model_id, license_plate: v.license_plate, status: v.status, battery_level: v.battery_level, battery_health: v.battery_health, location_id: v.location_id },
        model:     { id: model.vehicle_model_id, name: model.name, brand: model.brand, seats: model.seats, horsepower: model.horsepower, range_km: model.range_km, trunk_capacity: model.trunk_capacity, airbags: model.airbags, vehicle_type: model.vehicle_type, transmission: model.transmission },
        location:  { id: location.location_id, name: location.name, address: location.address, city: location.city, latitude: location.latitude, longitude: location.longitude },
        image_url: img?.image_url ?? "",
      };
    });
    return cards as T;
  }

  // GET /vehicles/:id/detail
  const vehicleDetailM = path.match(/^\/vehicles\/(\d+)\/detail$/);
  if (method === "GET" && vehicleDetailM) {
    const vid    = parseInt(vehicleDetailM[1], 10);
    const v      = _vehicles.find(x => x.vehicle_id === vid);
    if (!v) throw new MockApiError(404, "Xe không tồn tại.");
    const model    = vehicleModels.find(m => m.vehicle_model_id === v.vehicle_model_id)!;
    const location = locations.find(l => l.location_id === v.location_id)!;
    const imgs     = vehicleImages.filter(i => i.vehicle_model_id === v.vehicle_model_id);
    const fids     = vehicleModelFeatures.filter(mf => mf.vehicle_model_id === v.vehicle_model_id).map(mf => mf.feature_id);
    const feats    = vehicleFeatures.filter(f => fids.includes(f.feature_id));
    const specs    = vehicleSpecs.filter(s => s.vehicle_model_id === v.vehicle_model_id);
    const pricings = pricing.filter(p => p.vehicle_model_id === v.vehicle_model_id).map(p => {
      const rp = rentalPlans.find(r => r.rental_plan_id === p.rental_plan_id)!;
      return {
        pricing:     { id: p.pricing_id, model_id: p.vehicle_model_id, rental_plan_id: p.rental_plan_id, price: p.price },
        rental_plan: { id: rp.rental_plan_id, name: rp.name, duration_type: rp.duration_type, max_km: rp.max_km, overtime_price: rp.overtime_price, over_km_price: rp.over_km_price },
      };
    });

    // Tính avg rating từ reviews mock
    const mockReviews = [
      { id: 1, user_id: 2, model_id: 1, booking_id: 1, rating: 5, comment: "Xe sạch, dễ lái, đúng như mô tả.", created_at: "2026-04-25T12:30:00Z" },
      { id: 2, user_id: 2, model_id: 8, booking_id: 1, rating: 5, comment: "Tesla quá mượt, Autopilot ấn tượng!", created_at: "2026-04-26T10:00:00Z" },
      { id: 3, user_id: 3, model_id: 5, booking_id: 2, rating: 5, comment: "IONIQ 5 rộng, sạc nhanh, rất hài lòng.", created_at: "2026-05-06T08:00:00Z" },
    ].filter(r => r.model_id === v.vehicle_model_id);

    const avgRating = mockReviews.length > 0
      ? mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length
      : 4.8;

    return {
      vehicle:  { id: v.vehicle_id, model_id: v.vehicle_model_id, license_plate: v.license_plate, status: v.status, battery_level: v.battery_level, battery_health: v.battery_health, location_id: v.location_id },
      model:    { id: model.vehicle_model_id, name: model.name, brand: model.brand, seats: model.seats, horsepower: model.horsepower, range_km: model.range_km, trunk_capacity: model.trunk_capacity, airbags: model.airbags, vehicle_type: model.vehicle_type, transmission: model.transmission },
      location: { id: location.location_id, name: location.name, address: location.address, city: location.city, latitude: location.latitude, longitude: location.longitude },
      images:   imgs.map(i => ({ id: i.image_id, model_id: i.vehicle_model_id, url: i.image_url })),
      features: feats.map(f => ({ feature_id: f.feature_id, feature_name: f.feature_name })),
      specs:    specs.map(s => ({ id: s.spec_id, model_id: s.vehicle_model_id, name: s.spec_name, value: s.spec_value })),
      pricing:  pricings,
      reviews:  mockReviews,
      meta:     { avg_rating: avgRating, review_count: mockReviews.length, available: v.status === "available" },
    } as T;
  }

  // GET /blog/posts
  if (method === "GET" && path === "/blog/posts") {
    return _posts.filter(p => p.status === "published").map(toApiPost) as T;
  }

  // GET /blog/posts/:slug
  const blogSlugM = path.match(/^\/blog\/posts\/(.+)$/);
  if (method === "GET" && blogSlugM) {
    const slug = blogSlugM[1];
    const p = _posts.find(x => x.slug === slug && x.status === "published");
    if (!p) throw new MockApiError(404, "Bài viết không tìm thấy.");
    return toApiPost(p) as T;
  }

  // GET /blog/categories
  if (method === "GET" && path === "/blog/categories") {
    return blogCategories as T;
  }

  // GET /my/posts
  if (method === "GET" && path === "/my/posts") {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    return _posts.filter(p => p.user_id === authedUser.user_id).map(toApiPost) as T;
  }

  // POST /my/posts
  if (method === "POST" && path === "/my/posts") {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    const d = body as any;
    const newPost = {
      post_id:      _nextPostId++,
      user_id:      authedUser.user_id,
      category_id:  d.category_id ?? null,
      title:        d.title,
      slug:         d.slug || d.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      excerpt:      d.excerpt,
      content:      d.content,
      cover_image:  d.cover_image,
      status:       "draft" as const,
      published_at: null,
      created_at:   new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    };
    _posts.push(newPost);
    return toApiPost(newPost) as T;
  }

  // PUT /my/posts/:id
  const myPostEditM = path.match(/^\/my\/posts\/(\d+)$/);
  if (method === "PUT" && myPostEditM) {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    const pid = parseInt(myPostEditM[1], 10);
    const idx = _posts.findIndex(p => p.post_id === pid && p.user_id === authedUser.user_id);
    if (idx < 0) throw new MockApiError(404, "Bài viết không tìm thấy.");
    const d = body as any;
    _posts[idx] = { ..._posts[idx], ...d, updated_at: new Date().toISOString() };
    return toApiPost(_posts[idx]) as T;
  }

  // POST /my/posts/:id/submit
  const myPostSubmitM = path.match(/^\/my\/posts\/(\d+)\/submit$/);
  if (method === "POST" && myPostSubmitM) {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    const pid = parseInt(myPostSubmitM[1], 10);
    const idx = _posts.findIndex(p => p.post_id === pid);
    if (idx >= 0) _posts[idx] = { ..._posts[idx], status: "pending" };
    return undefined as T;
  }

  // POST /my/posts/:id/withdraw
  const myPostWithdrawM = path.match(/^\/my\/posts\/(\d+)\/withdraw$/);
  if (method === "POST" && myPostWithdrawM) {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    const pid = parseInt(myPostWithdrawM[1], 10);
    const idx = _posts.findIndex(p => p.post_id === pid);
    if (idx >= 0) _posts[idx] = { ..._posts[idx], status: "draft" };
    return undefined as T;
  }

  // DELETE /my/posts/:id
  if (method === "DELETE" && myPostEditM) {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    const pid = parseInt(myPostEditM[1], 10);
    _posts = _posts.filter(p => !(p.post_id === pid && p.user_id === authedUser.user_id));
    return undefined as T;
  }

  // GET /customers/me/bookings
  if (method === "GET" && path === "/customers/me/bookings") {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    return _bookings.filter(b => b.user_id === authedUser.user_id).map(enrichBooking) as T;
  }

  // GET /admin/bookings
  if (method === "GET" && path === "/admin/bookings") {
    return _bookings.map(enrichBooking) as T;
  }

  // POST /bookings
  if (method === "POST" && path === "/bookings") {
    if (!authedUser) throw new MockApiError(401, "Chưa đăng nhập.");
    const d = body as any;
    const newBooking = {
      booking_id:     _nextBookingId++,
      user_id:        authedUser.user_id,
      vehicle_id:     d.vehicle_id,
      rental_plan_id: d.rental_plan_id,
      start_time:     d.start_time,
      end_time:       d.end_time,
      planned_km:     d.planned_km ?? 0,
      actual_km:      0,
      deposit_amount: d.deposit_amount,
      overtime_fee:   0,
      over_km_fee:    0,
      total_price:    d.total_price,
      status:         "confirmed",
      payment_method: d.payment_method ?? "transfer",
      created_at:     new Date().toISOString(),
    };
    _bookings.push(newBooking);
    // Cập nhật trạng thái xe
    const vi = _vehicles.findIndex(v => v.vehicle_id === d.vehicle_id);
    if (vi >= 0) _vehicles[vi] = { ..._vehicles[vi], status: "booked" };
    return enrichBooking(newBooking) as T;
  }

  // PATCH /admin/bookings/:id/status
  const bookingStatusM = path.match(/^\/admin\/bookings\/(\d+)\/status$/);
  if (method === "PATCH" && bookingStatusM) {
    const bid = parseInt(bookingStatusM[1], 10);
    const { status } = body as { status: string };
    const idx = _bookings.findIndex(b => b.booking_id === bid);
    if (idx < 0) throw new MockApiError(404, "Đơn thuê không tồn tại.");
    _bookings[idx] = { ..._bookings[idx], status };
    return enrichBooking(_bookings[idx]) as T;
  }

  // PUT /admin/bookings/:id
  const bookingEditM = path.match(/^\/admin\/bookings\/(\d+)$/);
  if (method === "PUT" && bookingEditM) {
    const bid = parseInt(bookingEditM[1], 10);
    const idx = _bookings.findIndex(b => b.booking_id === bid);
    if (idx < 0) throw new MockApiError(404, "Đơn thuê không tồn tại.");
    _bookings[idx] = { ..._bookings[idx], ...(body as any) };
    return enrichBooking(_bookings[idx]) as T;
  }

  // POST /admin/vehicles
  if (method === "POST" && path === "/admin/vehicles") {
    const d = body as any;
    const newV = {
      vehicle_id:       _nextVehicleId++,
      vehicle_model_id: d.model_id,
      license_plate:    d.license_plate,
      status:           d.status ?? "available",
      battery_level:    d.battery_level ?? 100,
      battery_health:   d.battery_health ?? 100,
      location_id:      d.location_id,
    };
    _vehicles.push(newV);
    if (d.image_url) {
      vehicleImages.push({ image_id: vehicleImages.length + 1, vehicle_model_id: d.model_id, image_url: d.image_url });
    }
    return newV as T;
  }

  // PUT /admin/vehicles/:id
  const vehicleEditM = path.match(/^\/admin\/vehicles\/(\d+)$/);
  if (method === "PUT" && vehicleEditM) {
    const vid = parseInt(vehicleEditM[1], 10);
    const idx = _vehicles.findIndex(v => v.vehicle_id === vid);
    if (idx < 0) throw new MockApiError(404, "Xe không tồn tại.");
    const d = body as any;
    _vehicles[idx] = { ..._vehicles[idx], vehicle_model_id: d.model_id, license_plate: d.license_plate, status: d.status, battery_level: d.battery_level, battery_health: d.battery_health, location_id: d.location_id };
    return _vehicles[idx] as T;
  }

  // DELETE /admin/vehicles/:id
  if (method === "DELETE" && vehicleEditM) {
    const vid = parseInt(vehicleEditM[1], 10);
    _vehicles = _vehicles.filter(v => v.vehicle_id !== vid);
    return undefined as T;
  }

  // GET /admin/posts
  if (method === "GET" && path === "/admin/posts") {
    return _posts.map(toApiPost) as T;
  }

  // PUT /admin/posts/:id/status
  const adminPostStatusM = path.match(/^\/admin\/posts\/(\d+)\/status$/);
  if (method === "PUT" && adminPostStatusM) {
    const pid = parseInt(adminPostStatusM[1], 10);
    const { status, reject_reason } = body as { status: string; reject_reason?: string };
    const idx = _posts.findIndex(p => p.post_id === pid);
    if (idx < 0) throw new MockApiError(404, "Bài viết không tồn tại.");
    _posts[idx] = {
      ..._posts[idx],
      status: status as any,
      published_at: status === "published" ? new Date().toISOString() : _posts[idx].published_at,
      ...(reject_reason ? { reject_reason } : {}),
    };
    return undefined as T;
  }

  // DELETE /admin/posts/:id
  const adminPostDeleteM = path.match(/^\/admin\/posts\/(\d+)$/);
  if (method === "DELETE" && adminPostDeleteM) {
    const pid = parseInt(adminPostDeleteM[1], 10);
    _posts = _posts.filter(p => p.post_id !== pid);
    return undefined as T;
  }

  throw new MockApiError(404, `Mock: route không tìm thấy → ${method} ${path}`);
}
