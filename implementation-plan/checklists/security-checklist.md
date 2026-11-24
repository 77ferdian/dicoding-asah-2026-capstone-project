# 🔒 Security Checklist — Sebelum Production Deployment

**Wajib selesai sebelum `git push` ke main dan sebelum demo!**  
**Penanggung Jawab**: Ferdian (AIFS) + Ahmad Ghilman (AIFS)

---

## 🔑 Credential Management

- [ ] File `.env` **TIDAK** ada di Git history (`git log --all -- .env` → kosong)
- [ ] File `.env.example` sudah ada (berisi key tapi tanpa nilai sensitif)
- [ ] `.gitignore` mengecualikan: `.env`, `.env.*`, `*.pem`, `node_modules/`, `__pycache__/`
- [ ] `ACCESS_TOKEN_KEY` minimal 32 karakter random (bukan "secret" atau "12345")
- [ ] `REFRESH_TOKEN_KEY` minimal 32 karakter random, berbeda dari `ACCESS_TOKEN_KEY`
- [ ] `PGPASSWORD` adalah password yang kuat (bukan password default)
- [ ] `GEMINI_API_KEY` tidak di-hardcode di kode manapun
- [ ] Aktifkan API key restriction di Google Cloud Console (domain/IP whitelist)

```bash
# Generate random secret yang aman
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Database Security

- [ ] `database-sg` inbound rule port 5432 **HANYA** dari `web-app-sg` (BUKAN 0.0.0.0/0!)
- [ ] Verifikasi: tidak bisa connect ke RDS dari komputer lokal langsung (harus via EC2)
- [ ] Semua query PostgreSQL menggunakan parameterized query (`$1`, `$2`, bukan string concat)
- [ ] Tidak ada `DROP`, `TRUNCATE`, `DELETE` tanpa WHERE di kode production
- [ ] RDS tidak enable public accessibility

```sql
-- ✅ BENAR — parameterized query
pool.query('SELECT * FROM users WHERE username = $1', [username])

-- ❌ SALAH — rentan SQL injection
pool.query(`SELECT * FROM users WHERE username = '${username}'`)
```

---

## 🌐 API Security

- [ ] `authMiddleware.js` terpasang di SEMUA endpoint yang butuh auth
- [ ] Endpoint auth-free HANYA: `POST /users`, `POST /authentications`, `PUT /authentications`, `DELETE /authentications`
- [ ] Semua input divalidasi dengan Joi sebelum diproses
- [ ] Error messages tidak mengungkap detail internal (stack trace, SQL error, dsb.)
- [ ] CORS hanya mengizinkan origin yang diperlukan (di production: domain frontend)
- [ ] Respon error konsisten: `{ status: 'fail', message: '...' }` tanpa detail teknis

```javascript
// ✅ BENAR — pesan error generik
throw new InvariantError('Kredensial yang diberikan salah.');

// ❌ SALAH — mengungkap detail internal
throw new Error(`Database error: ${err.message}`);
```

---

## 🔐 JWT Security

- [ ] `accessToken` expire dalam 15 menit (`ACCESS_TOKEN_AGE=900`)
- [ ] `refreshToken` disimpan di PostgreSQL, bukan hanya di client
- [ ] Logout menghapus `refreshToken` dari database
- [ ] Token yang sudah dihapus (logout) tidak bisa digunakan untuk refresh
- [ ] `jwt.verify()` digunakan (bukan `jwt.decode()` yang tidak memverifikasi signature)

---

## 🖥️ Infrastructure Security

- [ ] SSH port 22 di `web-app-sg` **HANYA** dari IP kamu (`{IP}/32`, bukan 0.0.0.0/0)
- [ ] File `.pem` EC2 key pair disimpan aman, tidak di-commit ke Git
- [ ] `chmod 400 lintang-bakso-key.pem` sudah dijalankan
- [ ] PM2 berjalan sebagai user non-root jika memungkinkan
- [ ] Nginx dikonfigurasi untuk tidak expose informasi server version
- [ ] Tidak ada port development yang terbuka di production (misalnya 8080, 3000)

---

## 🧹 Code Security

- [ ] Tidak ada `console.log` yang menampilkan password, token, atau data sensitif
- [ ] Tidak ada hardcoded credential di kode sumber
- [ ] `bcrypt.hash(password, 10)` digunakan (bukan MD5, SHA1, atau plain text)
- [ ] File `.pem` dan file certificate tidak ada di dalam repo
- [ ] Semua dependencies di-update ke versi terbaru yang stabil

```bash
# Cek dependency vulnerabilities
npm audit

# Update dependencies
npm update
```

---

## ✅ Final Security Sign-off

Sebelum demo kepada Pak Nawayoga, semua item di atas harus ✅.  
Tanda tangan persetujuan tim:

| Nama | Peran | Verifikasi |
|------|-------|------------|
| Ferdian | AIFS | ⬜ Disetujui |
| Ahmad Ghilman | AIFS | ⬜ Disetujui |
| Panji Arya | AIFS | ⬜ Disetujui |
| Sabilah | AI Engineer | ⬜ Disetujui |

---

> 📖 Referensi: [OWASP Top 10](https://owasp.org/www-project-top-ten/) | [vibecoding-skill/full-stack-security-guide.md](../../vibecoding-skill/full-stack-security-guide.md)
