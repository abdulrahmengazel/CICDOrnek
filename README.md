# Yemek Sipariş Sistemi

Bu proje iki parçadan oluşur:

- `backend/`: Java Spring Boot REST API
- `frontend/`: React + Vite kullanıcı arayüzü

## Özellikler

- Login ekranı
- Menü listeleme
- Sepete ürün ekleme ve adet güncelleme
- Sipariş oluşturma
- Son siparişleri görüntüleme

## Demo giriş bilgileri

- Kullanıcı adı: `demo`
- Şifre: `demo123`

## Backend çalıştırma

```bash
cd backend
mvn spring-boot:run
```

API varsayılan olarak `http://localhost:8080` üzerinde açılır.

## Frontend çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Arayüz varsayılan olarak `http://localhost:5173` üzerinde açılır ve `/api` isteklerini backend'e yönlendirir.

## Docker ile çalıştırma

Kök dizinde aşağıdaki komutu çalıştırın:

```bash
docker compose up --build
```

Yayınlanan portlar:

- Frontend: `http://localhost:4242`
- Backend: `http://localhost:4343`
- PostgreSQL: `localhost:5544`
