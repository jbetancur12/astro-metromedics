# Configuración de Deploy Automático con GitHub Actions

Este repositorio usa GitHub Actions para desplegar automáticamente a Digital Ocean cada vez que se hace push a la rama `main`.

## Secrets Requeridos en GitHub

Para que el workflow funcione, necesitas configurar los siguientes **GitHub Secrets**:

### 1. Ir a Settings → Secrets and variables → Actions → New repository secret

### 2. Agregar los siguientes secrets:

#### `DO_HOST`
- **Valor**: `209.97.156.169`
- **Descripción**: IP del servidor Digital Ocean

#### `DO_USERNAME`
- **Valor**: `metromedics`
- **Descripción**: Usuario SSH del servidor

#### `DO_SSH_KEY`
- **Valor**: Tu clave SSH privada completa
- **Descripción**: Clave privada SSH para conectar al servidor
- **Cómo obtenerla**:
  ```bash
  # En tu máquina local, copia el contenido de tu clave privada:
  cat ~/.ssh/id_rsa
  # o
  cat ~/.ssh/id_ed25519

  # Copia TODA la salida, incluyendo:
  # -----BEGIN OPENSSH PRIVATE KEY-----
  # ... contenido de la clave ...
  # -----END OPENSSH PRIVATE KEY-----
  ```

### 3. (Opcional) Configurar Environment

Puedes crear un environment llamado `production` en:
- **Settings → Environments → New environment**
- Nombre: `production`
- Esto permite agregar protecciones adicionales como:
  - Require reviewers antes de deploy
  - Restricciones de branch
  - Wait timer antes de deploy

## Proceso de Deploy

### Deploy Automático
1. Haces `git push origin main`
2. GitHub Actions se activa automáticamente
3. Ejecuta build del proyecto
4. Despliega al servidor de Digital Ocean
5. Verifica que el sitio funcione correctamente
6. Si algo falla, hace rollback automático

### Deploy Manual
También puedes ejecutar el deploy manualmente desde:
- **GitHub → Actions → Deploy to Digital Ocean → Run workflow**

## Flujo del Deploy

```mermaid
graph LR
    A[Push to main] --> B[Build & Test]
    B --> C[Upload Artifacts]
    C --> D[Download Artifacts]
    D --> E[Deploy via SCP]
    E --> F[Execute Deploy Script]
    F --> G{Server OK?}
    G -->|Yes| H[Deploy Success ✅]
    G -->|No| I[Rollback ❌]
```

## Monitoreo

Para ver el estado del deploy:
1. Ve a la pestaña **Actions** en GitHub
2. Haz clic en el workflow que se está ejecutando
3. Verás cada paso del proceso en tiempo real

## Rollback Manual

Si necesitas volver a una versión anterior:

```bash
# Conectarse al servidor
ssh metromedics@209.97.156.169

# Ver builds disponibles
cd /home/metromedics/mmcs/landingpage
ls -lt

# Copiar un build anterior a producción
sudo cp -r build20250930-160140/* /var/www/metromedics.co/html/
```

## Archivos Importantes

- `.github/workflows/deploy.yml` - Configuración del workflow
- `deploy.sh` - Script de deploy manual (backup)
- `package.json` - Dependencias y scripts de build

## Soporte

Si tienes problemas:
1. Revisa los logs en GitHub Actions
2. Verifica que los secrets estén configurados correctamente
3. Asegúrate de que el servidor tenga las dependencias necesarias (sudo, curl)