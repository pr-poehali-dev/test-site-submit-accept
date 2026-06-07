import json
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта и отправляет уведомление на email владельца."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "Не указано")
    phone = body.get("phone", "Не указан")
    message = body.get("message", "")

    notify_email = os.environ["NOTIFY_EMAIL"]
    gmail_password = os.environ["GMAIL_APP_PASSWORD"]

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #7c3aed, #db2777); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">⚡ Новая заявка!</h1>
      </div>
      <div style="padding: 32px; background: white;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 14px; width: 120px;">Имя</td>
            <td style="padding: 12px 0; color: #111; font-size: 16px; font-weight: 600;">{name}</td>
          </tr>
          <tr style="border-top: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #888; font-size: 14px;">Телефон</td>
            <td style="padding: 12px 0; color: #111; font-size: 16px; font-weight: 600;">{phone}</td>
          </tr>
          {"" if not message else f'''<tr style="border-top: 1px solid #f0f0f0;"><td style="padding: 12px 0; color: #888; font-size: 14px; vertical-align: top;">Сообщение</td><td style="padding: 12px 0; color: #111; font-size: 15px;">{message}</td></tr>'''}
        </table>
        <div style="margin-top: 32px; text-align: center;">
          <a href="tel:{phone}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #db2777); color: white; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
            ✅ Принять заявку
          </a>
        </div>
      </div>
      <div style="padding: 16px 32px; text-align: center; color: #aaa; font-size: 12px;">
        Заявка получена с вашего сайта
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка от {name}"
    msg["From"] = notify_email
    msg["To"] = notify_email
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(notify_email, gmail_password)
        smtp.sendmail(notify_email, notify_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True}),
    }
