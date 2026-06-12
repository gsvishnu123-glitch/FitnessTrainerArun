# FitnessTrainerArun Deployment Notes

## 1. Copy Static Files

Copy the static website/admin files to the Oracle Nginx root:

```bash
cd ~/websites/fitness-trainer-arun
sudo cp index.html style.css final-clean.css script.js admin.html admin.js client-login.html client-dashboard.html /var/www/fitnesstrainerarun/
```

## 2. Install Backend Dependencies

The backend stores AI leads, visitor analytics and admin-managed website content.

```bash
cd ~/websites/fitness-trainer-arun/backend
npm install
```

## 3. Start Or Restart Backend With PM2

First-time start from the project root:

```bash
cd ~/websites/fitness-trainer-arun
pm2 start backend/server.js --name fitness-trainer-backend
pm2 save
```

Restart after future deployments:

```bash
pm2 restart fitness-trainer-backend
pm2 save
```

If you are already inside the `backend` folder, start with:

```bash
pm2 start server.js --name fitness-trainer-backend
```

## 4. Nginx `/api` Proxy

The frontend and admin call `/api/...` on the live domain. Nginx should proxy `/api/` to the local backend:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Test API Health

```bash
curl http://127.0.0.1:3001/api/health
curl http://140.245.214.55/api/health
```

Both should return:

```json
{"ok":true}
```

## 6. Test Admin Content Manager

1. Open `http://140.245.214.55/admin.html`.
2. Login with the existing admin credentials.
3. Open `Website Content Manager`.
4. Edit a small field, for example Hero eyebrow text.
5. Click `Save Website Content`.
6. Open the website preview and confirm the public page updated.

## 7. Data Files To Preserve

The backend stores lightweight JSON data in:

- `backend/data/leads.json`
- `backend/data/visitors.json`
- `backend/data/site-content.json`

Back these files up before replacing the backend folder during deployment.
