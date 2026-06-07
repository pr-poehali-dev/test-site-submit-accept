import json
import os
import urllib.request
import urllib.parse
from datetime import datetime, timedelta


def _sql(query: str, params: tuple = ()):
    """Выполняет SQL через DATABASE_URL с помощью urllib (без psycopg2)."""
    import psycopg2
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(query, params)
    result = None
    try:
        result = cur.fetchone()
    except Exception:
        pass
    conn.commit()
    cur.close()
    conn.close()
    return result


def handler(event: dict, context) -> dict:
    """Принимает заявку: сохраняет пользователя в БД и выдаёт премиум тариф на 1 день."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    params = event.get("queryStringParameters") or {}
    email = params.get("email", "").strip()
    name = params.get("name", "").strip()
    phone = params.get("phone", "").strip()

    if not email:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8"},
            "body": _page("Ошибка", "Email не указан.", "#ef4444"),
        }

    import psycopg2
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    row = cur.fetchone()

    if row:
        user_id = row[0]
        cur.execute("UPDATE users SET name = %s, phone = %s WHERE id = %s", (name or None, phone or None, user_id))
    else:
        cur.execute(
            "INSERT INTO users (email, name, phone) VALUES (%s, %s, %s) RETURNING id",
            (email, name or None, phone or None),
        )
        user_id = cur.fetchone()[0]

    expires_at = datetime.now() + timedelta(days=1)
    cur.execute(
        "INSERT INTO user_tariffs (user_id, tariff, expires_at, granted_by) VALUES (%s, %s, %s, %s)",
        (user_id, "premium", expires_at, "admin"),
    )

    conn.commit()
    cur.close()
    conn.close()

    expires_str = expires_at.strftime("%d.%m.%Y в %H:%M")

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8"},
        "body": _page(
            "Премиум активирован!",
            f"Пользователю <b>{email}</b> выдан Premium тариф до {expires_str}.",
            "#10b981",
        ),
    }


def _page(title: str, message: str, color: str) -> str:
    icon = "✅" if color == "#10b981" else "❌"
    badge = "Premium • 1 день" if color == "#10b981" else "Ошибка"
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title}</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{ min-height: 100vh; display: flex; align-items: center; justify-content: center;
           background: #0a0a0f; font-family: Arial, sans-serif; }}
    .card {{ background: #111; border: 1px solid #222; border-radius: 24px; padding: 48px;
             max-width: 480px; width: 90%; text-align: center; }}
    .icon {{ width: 80px; height: 80px; border-radius: 50%; background: {color}22;
             display: flex; align-items: center; justify-content: center;
             margin: 0 auto 24px; font-size: 36px; }}
    h1 {{ color: #fff; font-size: 28px; margin-bottom: 12px; }}
    p {{ color: #888; font-size: 16px; line-height: 1.6; }}
    b {{ color: #ccc; }}
    .badge {{ display: inline-block; margin-top: 20px; padding: 8px 20px;
              border-radius: 50px; background: {color}22; color: {color};
              font-size: 14px; font-weight: 600; border: 1px solid {color}44; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">{icon}</div>
    <h1>{title}</h1>
    <p>{message}</p>
    <div class="badge">{badge}</div>
  </div>
</body>
</html>"""
