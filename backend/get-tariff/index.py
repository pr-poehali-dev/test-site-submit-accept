import json
import os
import psycopg2
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Возвращает текущий тариф пользователя по email."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    params = event.get("queryStringParameters") or {}
    email = params.get("email", "").strip()

    if not email:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "email required"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"tariff": "free", "active": False}),
        }

    user_id = row[0]
    now = datetime.now()

    cur.execute(
        "SELECT tariff, expires_at FROM user_tariffs WHERE user_id = %s AND expires_at > %s ORDER BY expires_at DESC LIMIT 1",
        (user_id, now),
    )
    tariff_row = cur.fetchone()
    cur.close()
    conn.close()

    if tariff_row:
        tariff, expires_at = tariff_row
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "tariff": tariff,
                "active": True,
                "expires_at": expires_at.strftime("%d.%m.%Y в %H:%M"),
            }),
        }

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"tariff": "free", "active": False}),
    }
