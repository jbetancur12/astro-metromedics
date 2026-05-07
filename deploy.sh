#!/bin/bash

# Nombre del archivo de registro de errores
error_log="error.log"

# Función para mostrar los errores
show_errors() {
  if [ -s "$error_log" ]; then
    echo "Se produjeron errores. Consulta el archivo $error_log para más detalles."
  else
    echo "El script se ejecutó sin errores."
  fi
}

echo "Ejecutando 'build'..."
npm run build
echo

# Verificar que la carpeta 'dist' existe
if [ ! -d "dist" ]; then
  echo "La carpeta 'dist' no existe. Asegúrate de que el build se haya generado correctamente."
  exit 1
fi



# Copiar la carpeta al servidor remoto
echo "Copiando la carpeta 'dist' al servidor remoto..."
scp -r "dist" metromedics@209.97.156.169:/home/metromedics/mmcs/landingpage 2>>"$error_log"
if [ $? -ne 0 ]; then
  echo "Error al copiar la carpeta 'dist' al servidor remoto."
  show_errors
  exit 1
fi

# Conectarse al servidor remoto y mover archivos al directorio de producción.
echo "Conectándose al servidor remoto y moviendo archivos..."
ssh metromedics@209.97.156.169 << 'EOF'
  set -x
  cd /home/metromedics/mmcs/landingpage

  # Obtener la fecha y hora actual
  timestamp=$(date +"%Y%m%d-%H%M%S")
  mv dist "build$timestamp"

  # Verificar el resultado del mv
  if [ $? -ne 0 ]; then
    echo "Error al mover la carpeta 'dist' al directorio de producción." >&2
    exit 1
  fi

  # Obtener el build anterior más reciente para rollback
  previous_build=$(ls -dt build*/ 2>/dev/null | sed -n '2p' | sed 's/\/$//')

  # Crear backup del contenido actual en producción
  echo "Creando backup del sitio actual..."
  sudo mkdir -p /var/www/metromedics.co/html_backup
  sudo rm -rf /var/www/metromedics.co/html_backup/*
  sudo cp -r /var/www/metromedics.co/html/* /var/www/metromedics.co/html_backup/ 2>/dev/null || true

  # Copiar nuevos archivos a producción
  echo "Desplegando nueva versión..."
  sudo cp -r "build$timestamp"/* /var/www/metromedics.co/html/

  # Verificar el resultado del cp
  if [ $? -ne 0 ]; then
    echo "Error al copiar los archivos al directorio de producción." >&2

    # Rollback: restaurar desde backup
    if [ -d "/var/www/metromedics.co/html_backup" ]; then
      echo "Iniciando rollback automático..."
      sudo cp -r /var/www/metromedics.co/html_backup/* /var/www/metromedics.co/html/
      echo "Rollback completado. Sitio restaurado a la versión anterior."
    fi
    exit 1
  fi

  # Verificar que el servidor web está funcionando
  echo "Verificando estado del servidor web..."
  http_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

  if [ "$http_status" != "200" ] && [ "$http_status" != "301" ] && [ "$http_status" != "302" ]; then
    echo "ADVERTENCIA: El servidor web no responde correctamente (HTTP $http_status)" >&2
    echo "Iniciando rollback automático..."

    # Rollback: restaurar desde backup
    sudo cp -r /var/www/metromedics.co/html_backup/* /var/www/metromedics.co/html/
    echo "Rollback completado. Sitio restaurado a la versión anterior."
    exit 1
  else
    echo "Servidor web funcionando correctamente (HTTP $http_status)"
    # Limpiar backup temporal
    sudo rm -rf /var/www/metromedics.co/html_backup
  fi

  # Conservar solo las 2 carpetas más recientes en el directorio /home/metromedics/mmcs/landingpage
  cd /home/metromedics/mmcs/landingpage
  # Listar los directorios ordenados por fecha de modificación (más reciente primero) y eliminar los que no sean los dos más recientes
  dirs_to_delete=$(ls -dt */ | awk 'NR>2')

  # Eliminar los directorios que no se deben conservar
  if [ -n "$dirs_to_delete" ]; then
    echo "Eliminando directorios antiguos..."
    rm -rf $dirs_to_delete
  fi

  echo "Despliegue completado exitosamente!"

EOF

# Mostrar errores
show_errors
