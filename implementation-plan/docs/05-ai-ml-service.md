# 05 — AI/ML Service (FastAPI + Gemini RAG)

**Penanggung Jawab**: Sabilah Amiruddin (AI Engineer)  
**Framework**: FastAPI (Python 3.11)  
**Model**: IndoBERT / ABSA (Aspect-Based Sentiment Analysis)  
**GenAI**: Gemini API (via backend Express.js)

---

## Arsitektur AI Layer

```
Express.js Backend
      │
      │  POST /predict { texts: [...] }
      ▼
FastAPI ML Service (Port 8000)
      │
      │  Inference: IndoBERT/ABSA Model
      ▼
Response: { results: [{ sentiment, aspects }] }

      ┌── Cache hit? ──► return cached response
      │
Express.js Backend ─► Gemini API
      │                    │
      │  POST ke /ai/insights   RAG: query PostgreSQL reviews
      ▼
PostgreSQL ai_cache (TTL 1 jam)
```

---

## FastAPI ML Service

### Setup Python Environment

```bash
cd ml-service
python3.11 -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows

pip install fastapi uvicorn transformers torch pydantic
pip freeze > requirements.txt
```

### `ml-service/main.py`

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Lintang Bakso ML Service",
    description="ABSA Model serving untuk klasifikasi sentimen & aspek ulasan",
    version="1.0.0"
)

# ============================================================
# Model Loading (saat startup)
# ============================================================
MODEL_NAME = "indobenchmark/indobert-base-p1"  # Ganti dengan model terlatih
tokenizer  = None
model      = None

@app.on_event("startup")
async def load_model():
    global tokenizer, model
    try:
        logger.info(f"Loading model: {MODEL_NAME}")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model     = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
        model.eval()
        logger.info("✅ Model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")

# ============================================================
# Request / Response Schemas
# ============================================================
class PredictRequest(BaseModel):
    texts: list[str]

class AspectLabels(BaseModel):
    rasa:      Optional[str] = None   # 'positive' | 'negative' | None
    harga:     Optional[str] = None
    pelayanan: Optional[str] = None
    tempat:    Optional[str] = None

class SingleResult(BaseModel):
    text:      str
    sentiment: str                    # 'positive' | 'negative'
    aspects:   AspectLabels
    confidence: float

class PredictResponse(BaseModel):
    results: list[SingleResult]
    model_version: str = "1.0.0"

# ============================================================
# Endpoints
# ============================================================
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_name": MODEL_NAME
    }

@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    if not req.texts:
        raise HTTPException(status_code=400, detail="texts tidak boleh kosong")
    if len(req.texts) > 100:
        raise HTTPException(status_code=400, detail="Maksimal 100 teks per request")

    results = []
    for text in req.texts:
        # TODO: Ganti dengan inference model ABSA yang sesungguhnya
        result = _dummy_predict(text)
        results.append(result)

    return {"results": results}

def _dummy_predict(text: str) -> dict:
    """
    PLACEHOLDER — Ganti dengan inference IndoBERT/ABSA asli.
    Tim DS/AI (Sabilah + Yanaka) mengisi logika ini dengan model terlatih.
    """
    text_lower = text.lower()

    # Keyword-based fallback (hanya untuk development/testing)
    keywords_positive = ['enak', 'lezat', 'mantap', 'bagus', 'ramah', 'bersih', 'murah', 'worth']
    keywords_negative = ['buruk', 'lama', 'mahal', 'kotor', 'kecewa', 'tidak', 'kurang']

    is_positive = any(kw in text_lower for kw in keywords_positive)
    sentiment   = 'positive' if is_positive else 'negative'

    aspects = {
        'rasa':      'positive' if any(w in text_lower for w in ['enak', 'lezat', 'rasa']) else None,
        'harga':     'negative' if any(w in text_lower for w in ['mahal', 'harga']) else None,
        'pelayanan': 'negative' if any(w in text_lower for w in ['lama', 'pelayan', 'antri']) else None,
        'tempat':    'negative' if any(w in text_lower for w in ['panas', 'sempit', 'parkir']) else None,
    }

    return {
        'text':       text,
        'sentiment':  sentiment,
        'aspects':    aspects,
        'confidence': 0.85
    }
```

### `ml-service/requirements.txt`

```
fastapi>=0.110.0
uvicorn[standard]>=0.29.0
transformers>=4.40.0
torch>=2.2.0
pydantic>=2.0.0
scikit-learn>=1.4.0
numpy>=1.26.0
```

### Menjalankan FastAPI

```bash
# Development
uvicorn main:app --reload --port 8000

# Production (di EC2)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2 &

# Atau via PM2 dengan Python
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name "lintang-ml"
```

---

## Integrasi FastAPI ke Backend Express.js

### `backend/src/services/ai/MlClient.js`

```javascript
const axios = require('axios');

const ML_URL = process.env.FASTAPI_ML_URL || 'http://localhost:8000';

async function predictSentiment(texts) {
  try {
    const response = await axios.post(`${ML_URL}/predict`, { texts }, {
      timeout: 30000, // 30 detik timeout
    });
    return response.data.results;
  } catch (error) {
    console.error('ML Service error:', error.message);
    // Fallback: jika ML service down, kembalikan null
    return null;
  }
}

async function checkMlHealth() {
  try {
    const res = await axios.get(`${ML_URL}/health`, { timeout: 5000 });
    return res.data.status === 'ok';
  } catch {
    return false;
  }
}

module.exports = { predictSentiment, checkMlHealth };
```

---

## Panduan Model ABSA untuk Tim DS

### Yang Diharapkan dari Model

| Input | Output |
|-------|--------|
| `"Baksonya enak tapi tempatnya panas"` | `{sentiment: 'positive', aspects: {rasa: 'positive', tempat: 'negative'}}` |
| `"Pelayanannya lama dan mahal"` | `{sentiment: 'negative', aspects: {pelayanan: 'negative', harga: 'negative'}}` |

### Metrik Evaluasi (F1-Score)

```
Target minimum F1-Score:
- Sentiment Classification: F1 ≥ 0.80
- Aspect Detection (rasa):      F1 ≥ 0.75
- Aspect Detection (harga):     F1 ≥ 0.70
- Aspect Detection (pelayanan): F1 ≥ 0.70
- Aspect Detection (tempat):    F1 ≥ 0.70
```

### Model Options yang Bisa Digunakan

1. **IndoBERT** (`indobenchmark/indobert-base-p1`) — Fine-tune untuk ABSA
2. **mBERT** — Multilingual BERT
3. **Zero-Shot dengan Gemini API** — Fallback jika model ABSA akurasi rendah

### Zero-Shot Fallback (Jika Model Kurang Akurat)

```python
# Fallback: gunakan Gemini untuk klasifikasi sentimen
import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_KEY")
model = genai.GenerativeModel('gemini-pro')

def classify_with_llm(text: str) -> dict:
    prompt = f"""
Klasifikasikan sentimen ulasan restoran berikut dalam Bahasa Indonesia.
Ulasan: "{text}"

Jawab HANYA dalam format JSON:
{{
  "sentiment": "positive" atau "negative",
  "aspects": {{
    "rasa": "positive" atau "negative" atau null,
    "harga": "positive" atau "negative" atau null,
    "pelayanan": "positive" atau "negative" atau null,
    "tempat": "positive" atau "negative" atau null
  }}
}}
"""
    response = model.generate_content(prompt)
    import json, re
    match = re.search(r'\{.*\}', response.text, re.DOTALL)
    return json.loads(match.group())
```

---

## Prompt Engineering untuk RAG (Gemini)

### Template Prompt Utama

```
System: Kamu adalah analis bisnis UMKM kuliner di Indonesia yang berpengalaman.

User: Berdasarkan ulasan digital berikut dari Lintang Bakso dan kompetitor di Surabaya:

[KONTEKS ULASAN — diambil dari PostgreSQL reviews table]
[Lintang Bakso][positive]: Baksonya enak dan kuahnya gurih
[Bakso Pak Djo][positive]: Pelayanannya cepat dan ramah
[Lintang Bakso][negative]: Tempatnya panas dan sempit
...

Aspek fokus: {aspect}
Periode: {timeRange}

Berikan dalam format JSON:
{
  "executiveSummary": "...",
  "actionableRecommendations": ["...", "...", "..."]
}
```

### Tips Prompt Engineering

1. **Batasi konteks** — maksimal 50 ulasan agar tidak melebihi token limit
2. **Format output ketat** — minta JSON agar mudah di-parse
3. **Bahasa Indonesia** — Gemini mendukung dengan baik
4. **Konkret** — minta rekomendasi yang spesifik dan actionable

---

> 📅 Last updated: 24 November 2026 | Author: Sabilah Amiruddin (AI Engineer)
