# API Contracts — Autentikasi & Pengguna

**Base URL**: `http://<server>:5000`  
**Format Respons**: `application/json`

---

## Struktur Respons Standar

```json
// Sukses
{ "status": "success", "message": "...", "data": { ... } }

// Gagal Client (400/401/403/404)
{ "status": "fail", "message": "Pesan error yang jelas" }

// Gagal Server (500)
{ "status": "error", "message": "Terjadi kesalahan pada server." }
```

---

## 1. `POST /users` — Registrasi Pengguna Baru

**Request:**
```http
POST /users
Content-Type: application/json

{
  "username": "owner_lintang",
  "password": "secret_password123",
  "fullname": "Pemilik Lintang Bakso"
}
```

**Validasi (Joi):**
- `username`: string, min 3, max 50, hanya alfanumerik + underscore, required
- `password`: string, min 8, required
- `fullname`: string, min 1, max 100, required

**Response 201 Created:**
```json
{
  "status": "success",
  "message": "User berhasil ditambahkan",
  "data": {
    "userId": "user-A1b2C3d4E5f6"
  }
}
```

**Error Cases:**
| HTTP | Kondisi | Message |
|------|---------|---------|
| 400 | Validasi gagal | `"Username harus berupa string."` |
| 400 | Username sudah digunakan | `"Username sudah digunakan."` |

---

## 2. `POST /authentications` — Login

**Request:**
```http
POST /authentications
Content-Type: application/json

{
  "username": "owner_lintang",
  "password": "secret_password123"
}
```

**Response 201 Created:**
```json
{
  "status": "success",
  "message": "Authentication berhasil ditambahkan",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Cases:**
| HTTP | Kondisi | Message |
|------|---------|---------|
| 400 | Username tidak ada | `"Kredensial yang diberikan salah."` |
| 400 | Password salah | `"Kredensial yang diberikan salah."` |

> 🔒 Jangan bedakan error "username tidak ada" vs "password salah" untuk mencegah user enumeration!

---

## 3. `PUT /authentications` — Refresh Access Token

**Request:**
```http
PUT /authentications
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 OK:**
```json
{
  "status": "success",
  "message": "Access Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_NEW..."
  }
}
```

**Error Cases:**
| HTTP | Kondisi | Message |
|------|---------|---------|
| 400 | refreshToken tidak ada di body | `"'refreshToken' wajib diisi."` |
| 400 | refreshToken tidak valid / tidak ada di DB | `"Refresh token tidak valid."` |

---

## 4. `DELETE /authentications` — Logout

**Request:**
```http
DELETE /authentications
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 OK:**
```json
{
  "status": "success",
  "message": "Refresh token berhasil dihapus"
}
```

---

## Postman Test Scripts

### Test: POST /users

```javascript
// Tests tab Postman
pm.test("Status 201", () => pm.response.to.have.status(201));
pm.test("Response berisi userId", () => {
  const json = pm.response.json();
  pm.expect(json.status).to.eql('success');
  pm.expect(json.data.userId).to.be.a('string');
  pm.environment.set('userId', json.data.userId);
});
```

### Test: POST /authentications

```javascript
pm.test("Status 201", () => pm.response.to.have.status(201));
pm.test("Response berisi accessToken dan refreshToken", () => {
  const json = pm.response.json();
  pm.expect(json.status).to.eql('success');
  pm.expect(json.data.accessToken).to.be.a('string');
  pm.expect(json.data.refreshToken).to.be.a('string');
  pm.environment.set('accessToken',  json.data.accessToken);
  pm.environment.set('refreshToken', json.data.refreshToken);
});
```

### Test: Unauthorized (tanpa token)

```javascript
pm.test("Status 401 tanpa token", () => pm.response.to.have.status(401));
pm.test("Status fail", () => {
  pm.expect(pm.response.json().status).to.eql('fail');
});
```

---

> 📅 Last updated: 24 November 2026 | Author: Ahmad Ghilman (AIFS)
