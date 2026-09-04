# Akgün Sulama Sistemleri

Proje birbirinden bağımsız çalışan iki uygulamadan oluşur:

- `frontend`: Web sitesi, yönetim paneli ve statik dosya sunucusu
- `backend`: Ürün kataloğu REST API'si ve JSON veri deposu

## Yerel çalıştırma

İki ayrı terminal açın:

```powershell
cd backend
npm.cmd start
```

```powershell
cd frontend
npm.cmd start
```

Site `http://localhost:5500`, yönetim paneli `http://localhost:5500/admin/`, API ise `http://localhost:3001` adresinde açılır.

Ortam ayarlarını değiştirmek için ilgili klasörde `.env.example` dosyasını `.env` adıyla kopyalayın. Frontend'deki `API_BASE_URL` ile backend'deki `FRONTEND_ORIGIN` değerleri birbiriyle uyumlu olmalıdır.
