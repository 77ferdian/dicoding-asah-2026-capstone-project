# 06 — Deployment AWS (EC2 + RDS + PM2)

**Penanggung Jawab**: Ferdian (AIFS)  
**Target**: AWS EC2 Ubuntu 22.04 LTS + AWS RDS PostgreSQL 15

---

## Infrastruktur Overview

```
Internet
   │
   ▼
┌──────────────────────────────────────┐
│          AWS Security Group           │
│  web-app-sg                          │
│  - Port 80/443 → 0.0.0.0/0 (HTTP/S) │
│  - Port 5000   → 0.0.0.0/0 (API)    │
│  - Port 22     → {Your IP}/32 (SSH)  │
└──────────────────┬───────────────────┘
                   │
         ┌─────────▼──────────┐
         │   AWS EC2 Instance  │
         │   Ubuntu 22.04 LTS  │
         │   t2.micro / t3.small│
         │                     │
         │  ┌───────────────┐  │
         │  │ PM2 (Node.js) │  │
         │  │ Port: 5000    │  │
         │  └───────────────┘  │
         │  ┌───────────────┐  │
         │  │ FastAPI+Uvicorn│  │
         │  │ Port: 8000    │  │
         │  └───────────────┘  │
         │  ┌───────────────┐  │
         │  │ Nginx (Reverse│  │
         │  │ Proxy + Static│  │
         │  └───────────────┘  │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │ AWS Security Group   │
         │ database-sg          │
         │ - Port 5432 → HANYA  │
         │   dari web-app-sg    │
         │   (BUKAN 0.0.0.0/0!) │
         └──────────────────────┘
                    │
         ┌──────────▼──────────┐
         │   AWS RDS Instance   │
         │   PostgreSQL 15.x    │
         │   db.t3.micro        │
         └──────────────────────┘
```

---

## Step-by-Step Setup EC2

### 1. Launch EC2 Instance

```
AMI:          Ubuntu Server 22.04 LTS (HVM)
Instance:     t2.micro (free tier) atau t3.small
Storage:      20 GB gp3
Key pair:     Buat baru → download .pem
Security Group: web-app-sg (lihat konfigurasi di bawah)
```

### 2. Konfigurasi Security Groups

**web-app-sg (untuk EC2):**
| Type | Protocol | Port | Source |
|------|----------|------|--------|
| SSH | TCP | 22 | {IP Kamu}/32 |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |

**database-sg (untuk RDS):**
| Type | Protocol | Port | Source |
|------|----------|------|--------|
| PostgreSQL | TCP | 5432 | web-app-sg (ID Security Group) |

> ⚠️ **PENTING**: Source untuk port 5432 wajib `web-app-sg`, BUKAN `0.0.0.0/0`!

### 3. Connect ke EC2 via SSH

```bash
chmod 400 lintang-bakso-key.pem
ssh -i lintang-bakso-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### 4. Install Dependencies di EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node --version   # v20.x.x
npm --version    # 10.x.x

# Install PM2 global
sudo npm install -g pm2

# Install Python 3.11
sudo apt install python3.11 python3.11-pip python3.11-venv -y
python3.11 --version

# Install Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
```

### 5. Clone Repository

```bash
# Generate SSH key untuk GitHub
ssh-keygen -t ed25519 -C "ferdian@lintangbakso"
cat ~/.ssh/id_ed25519.pub
# → Tambahkan ke GitHub Settings → SSH Keys

# Clone repo
git clone git@github.com:A26-CS065/lintang-bakso.git
cd lintang-bakso
```

### 6. Setup Backend

```bash
cd backend
npm install --production

# Buat .env dari template
cp .env.example .env
nano .env
# → Isi semua variabel sesuai nilai produksi

# Jalankan database migration
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < ../database/migrations/001_init_schema.sql

# Start dengan PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
# → Ikuti instruksi yang muncul untuk setup autostart
```

### 7. Setup ML Service (FastAPI)

```bash
cd ../ml-service
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Test manual
uvicorn main:app --host 127.0.0.1 --port 8000 &
curl http://localhost:8000/health

# Jalankan via PM2
pm2 start "source venv/bin/activate && uvicorn main:app --host 127.0.0.1 --port 8000" \
  --name "lintang-ml" \
  --interpreter bash
pm2 save
```

### 8. Build & Deploy Frontend

```bash
cd ../frontend

# Set variabel production
echo "VITE_API_URL=http://<EC2-IP>:5000" > .env.production

npm install
npm run build
# → Output: dist/

# Copy ke Nginx webroot
sudo cp -r dist/* /var/www/html/
```

### 9. Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/lintang-bakso
```

```nginx
server {
    listen 80;
    server_name <EC2-IP>;

    # Frontend static files
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass         http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lintang-bakso /etc/nginx/sites-enabled/
sudo nginx -t          # Verifikasi config
sudo systemctl reload nginx
```

---

## Setup AWS RDS PostgreSQL

```
Engine:          PostgreSQL 15.x
Template:        Free tier
DB Instance ID:  lintang-bakso-db
Master username: lintang_admin
Master password: [generate secure password]
Instance class:  db.t3.micro
Storage:         20 GB gp2
VPC:             Default
Security Group:  database-sg (hanya dari web-app-sg)
Public access:   NO
```

**Test koneksi dari EC2:**
```bash
psql -h <RDS-ENDPOINT> -U lintang_admin -d lintang_bakso_db
```

---

## PM2 Monitoring & Commands

```bash
# Status semua proses
pm2 status

# Live logs
pm2 logs lintang-api
pm2 logs lintang-ml

# Restart
pm2 restart lintang-api
pm2 restart lintang-ml

# Reload tanpa downtime (Node.js)
pm2 reload lintang-api

# Monitor dashboard
pm2 monit
```

---

## Checklist Deployment Final

```
[ ] EC2 instance running dan SSH bisa terhubung
[ ] Security Groups dikonfigurasi dengan benar (database-sg HANYA dari web-app-sg)
[ ] RDS PostgreSQL bisa diakses dari EC2 (test via psql)
[ ] Migration SQL berhasil dijalankan (cek tabel ada)
[ ] .env produksi sudah diisi dengan nilai yang benar
[ ] PM2 lintang-api berjalan (pm2 status = online)
[ ] PM2 lintang-ml berjalan (pm2 status = online)
[ ] curl http://localhost:5000/health → { status: 'ok' }
[ ] curl http://localhost:8000/health → { status: 'ok' }
[ ] Nginx berjalan dan serve frontend
[ ] Frontend bisa diakses via browser http://<EC2-IP>
[ ] Login flow berhasil end-to-end
[ ] pm2 save && pm2 startup dikonfigurasi (autostart saat reboot)
```

---

## Troubleshooting Umum

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|---------------------|--------|
| `ECONNREFUSED` ke PostgreSQL | Security Group salah / SSL belum diset | Cek `database-sg`, tambah `rejectUnauthorized: false` |
| PM2 `errored` | Error di server.js / .env tidak lengkap | `pm2 logs lintang-api` untuk lihat error |
| Nginx 502 Bad Gateway | Backend belum running / port salah | `pm2 status`, cek port di `proxy_pass` |
| `JWT malformed` | Token lama / format salah | Clear localStorage, login ulang |
| Gemini API error | API key salah / rate limit | Cek `.env GEMINI_API_KEY`, cek Gemini Console |

---

> 📅 Last updated: 24 November 2026 | Author: Ferdian (AIFS)
