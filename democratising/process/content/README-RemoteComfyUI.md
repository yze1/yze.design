# Remote ComfyUI Tunnel via Cloudflare

This system allows you to securely run and access [ComfyUI](https://github.com/comfyanonymous/ComfyUI) remotely through a Cloudflare Tunnel, using a custom domain. It's configured to run from a Windows machine and accessible anywhere via HTTPS.

## 🌐 URL

**Live endpoint:** `https://comfy.zzzyze.uk`

---

## 🧱 System Overview

| Component         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| ComfyUI           | AI image generation frontend running on `localhost:8188`                   |
| cloudflared       | Creates a secure Cloudflare Tunnel exposing the local server               |
| Domain            | Uses `zzzyze.uk`, DNS managed via Cloudflare                               |
| Tunnel Type       | Named Tunnel using `config.yml` for persistent and stable routing          |
| Security Layer    | Can be optionally enhanced with Cloudflare Access for login protection     |

---

## 🖥 How It Works

1. ComfyUI starts and binds to `127.0.0.1:8188` locally.
2. A named Cloudflare Tunnel forwards external HTTPS traffic from `comfy.zzzyze.uk` to the local server.
3. The domain is configured with a CNAME pointing to the tunnel's `cfargotunnel.com` endpoint.
4. Cloudflare proxies and encrypts the connection.

---

## ⚙️ Configuration Files

### `.cloudflared/config.yml`

```
tunnel: comfyui-tunnel
credentials-file: C:\Users\ejbcr\.cloudflared\cb523e9b-93d4-4dea-be2d-f97aec0704e8.json

ingress:
  - hostname: comfy.zzzyze.uk
    service: http://127.0.0.1:8188
  - service: http_status:404
```

---

## ▶️ Startup Instructions

### Manually
1. Start ComfyUI:
   ```bash
   cd C:\Users\ejbcr\ComfyUI
   call venv\Scripts\activate.bat
   python main.py
   ```

2. Start Cloudflare Tunnel:
   ```bash
   cloudflared tunnel run comfyui-tunnel
   ```

### With `.bat` file

```bat
@echo off
start "" cmd /k "cd /d C:\Users\ejbcr\ComfyUI && call venv\Scripts\activate.bat && python main.py"
timeout /t 10 /nobreak
start "" cmd /k "cloudflared tunnel run comfyui-tunnel"
```

---

## 🛡 Security & Access (Optional)

To restrict access:
- Use **Cloudflare Access** rules on `comfy.zzzyze.uk`
- Require email login or OAuth (e.g. Google) to view the interface

---

## 📦 Dependencies

- [Cloudflare Tunnel (`cloudflared`)](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
- Python 3.10+ (for ComfyUI)
- A registered Cloudflare account + domain (`zzzyze.uk`)

---

## 📁 Folder Structure

```
C:\Users\ejbcr\
├── ComfyUI\
│   ├── venv\
│   ├── main.py
│   └── custom_nodes\
└── .cloudflared\
    ├── config.yml
    └── cb523e9b-93d4-4dea-be2d-f97aec0704e8.json
```

---

## 💡 Credits

Built by Eddie Cranmer for remote generative art workflows using ComfyUI and custom AI pipelines.

---

## 🔗 License

This configuration is shared for educational and personal development purposes.