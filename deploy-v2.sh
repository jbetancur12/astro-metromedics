#!/bin/bash
# Despliega la vista previa del rediseño (v2) en un subdominio aparte.
# No toca el sitio real: usa otra carpeta y otro bloque de nginx.
#
# Uso:  bash deploy-v2.sh
# Antes (una sola vez): crear el DNS y el bloque de nginx con scripts/v2/nginx-v2.sh
# (ver scripts/v2/README.md).

set -u

SERVIDOR="metromedics@209.97.156.169"
DOMINIO="${V2_DOMINIO:-v2.metromedicslab.com}"
CARPETA_REMOTA="/home/metromedics/mmcs/landingpage-v2"
RAIZ_WEB="/var/www/${DOMINIO}/html"
error_log="error-v2.log"

echo "Construyendo la vista previa (noindex, sin analítica, sin sitemap)..."
# Nada de esto debe tocar producción: el formulario de contacto apunta a una API
# inexistente a propósito y el modal de captación de leads queda apagado.
PUBLIC_PREVIEW=1 \
PREVIEW_SITE="https://${DOMINIO}" \
PUBLIC_LEAD_MAGNET_ENABLED=false \
PUBLIC_API_URL="https://api-v2-desactivada.invalid" \
  npm run build || { echo "El build falló."; exit 1; }

if [ ! -d "dist" ]; then
  echo "No existe la carpeta 'dist'. El build no se generó."
  exit 1
fi

# Seguro extra: la vista previa NUNCA debe salir sin noindex.
if ! grep -q 'content="noindex' dist/index.html; then
  echo "dist/index.html no tiene noindex. Se cancela el despliegue."
  exit 1
fi
if ! grep -q "^Disallow: /" dist/robots.txt; then
  echo "dist/robots.txt no cierra el sitio. Se cancela el despliegue."
  exit 1
fi

echo "Preparando la carpeta remota..."
ssh "$SERVIDOR" "mkdir -p ${CARPETA_REMOTA} && rm -rf ${CARPETA_REMOTA}/dist" 2>>"$error_log" || { echo "No se pudo preparar el servidor."; exit 1; }

echo "Copiando 'dist' al servidor..."
scp -r dist "${SERVIDOR}:${CARPETA_REMOTA}/" 2>>"$error_log" || { echo "No se pudo copiar 'dist'."; exit 1; }

echo "Publicando en ${RAIZ_WEB}..."
ssh "$SERVIDOR" bash -s <<REMOTO
  set -e
  cd ${CARPETA_REMOTA}
  stamp=\$(date +"%Y%m%d-%H%M%S")
  mv dist "build\$stamp"

  sudo mkdir -p ${RAIZ_WEB}
  sudo rm -rf ${RAIZ_WEB}/*
  sudo cp -r "build\$stamp"/* ${RAIZ_WEB}/

  # Conservar solo los 2 builds más recientes
  ls -dt build*/ | awk 'NR>2' | xargs -r rm -rf

  # Pide el host real: nginx cierra con 444 las peticiones a hosts desconocidos.
  codigo=\$(curl -s -o /dev/null -w "%{http_code}" --resolve ${DOMINIO}:443:127.0.0.1 https://${DOMINIO}/ || true)
  echo "Respuesta de https://${DOMINIO}/ : \$codigo"
  case "\$codigo" in
    200|301|302|401) echo "Vista previa publicada." ;;
    *) echo "AVISO: el sitio no responde bien todavía. Revisa nginx y el certificado (scripts/v2/README.md)." ;;
  esac
REMOTO

echo
echo "Listo. Vista previa: https://${DOMINIO}/"
[ -s "$error_log" ] && echo "Hubo mensajes en $error_log."
exit 0
