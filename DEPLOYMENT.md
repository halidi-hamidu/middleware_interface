# Deployment Guide - IP-Only Access

## Quick Start

### 1. Build the Docker Image
```bash
docker build -t middleware-frontend:latest .
```

### 2. Run with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Access the Application
Open your browser and navigate to:
```
http://<YOUR_SERVER_IP>
```

Example:
```
http://192.168.1.100
```

## Manual Docker Run (Alternative)

If you prefer to run without docker-compose:

```bash
docker run -d \
  --name middleware-frontend \
  --restart unless-stopped \
  -p 80:80 \
  middleware-frontend:latest
```

## Configuration

### Backend API
The application is configured to connect to the backend at:
- **Host**: 185.53.211.11
- **Port**: 8082
- **WebSocket**: ws://185.53.211.11:8082/api/socket
- **HTTP API**: http://185.53.211.11:8082/api

### Port Mapping
- Container exposes port 80 (nginx)
- Mapped to host port 80
- Access directly via server IP address

## Management Commands

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

Or for standalone container:
```bash
docker logs -f middleware-frontend
```

### Stop Application
```bash
docker-compose -f docker-compose.prod.yml down
```

Or for standalone container:
```bash
docker stop middleware-frontend
docker rm middleware-frontend
```

### Rebuild and Restart
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## Updating the Application

### Pull Latest Code
```bash
git pull origin master
```

### Rebuild and Deploy
```bash
docker-compose -f docker-compose.prod.yml down
docker build -t middleware-frontend:latest .
docker-compose -f docker-compose.prod.yml up -d
```

## CI/CD

GitHub Actions automatically builds and pushes images to GitHub Container Registry (ghcr.io) on every push to master.

To pull from registry:
```bash
docker pull ghcr.io/halidi-hamidu/middleware-frontend:latest
```

## Troubleshooting

### Port 80 Already in Use
If port 80 is already in use, modify `docker-compose.prod.yml`:
```yaml
ports:
  - "8080:80"  # Change host port to 8080
```

Then access via: `http://<YOUR_SERVER_IP>:8080`

### Application Not Loading
1. Check if container is running:
   ```bash
   docker ps
   ```

2. Check container logs:
   ```bash
   docker logs middleware-frontend
   ```

3. Verify backend connectivity:
   ```bash
   curl -v http://185.53.211.11:8082/api
   ```

### Container Keeps Restarting
Check logs for errors:
```bash
docker logs middleware-frontend --tail 100
```

Common issues:
- Port conflict (see above)
- Nginx configuration error
- Build artifacts missing

## Network Configuration

The application runs in a Docker bridge network named `middleware-network`. This provides isolation while allowing containers to communicate if needed.

## Security Notes

- Application runs on port 80 (HTTP only)
- For production with HTTPS, consider adding a reverse proxy like Nginx or Traefik
- Backend API is accessed directly at 185.53.211.11:8082
- No domain name or SSL certificates required for IP-only access
