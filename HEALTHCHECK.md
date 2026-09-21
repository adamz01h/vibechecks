# Container health

The application exposes `GET /api/health`. It returns `{"ok":true}` after the API can reach MySQL.

## Start

Copy `compose.env.example` to `.env`, change both database passwords, then run:

```sh
docker compose up -d --build
```

Open `http://localhost:3001`.

## Logs

```sh
docker compose logs -f app
docker compose logs -f db
```

## Stop

```sh
docker compose down
```

To also permanently delete the MySQL volume, use `docker compose down -v`.
