#!/bin/bash

FTP_HOST="82.194.68.107"
FTP_USER="user-10950929"
FTP_PASS="Castilla73.."
FTP_PATH="iasolutionspro.es/dinos/"

echo "Subiendo archivos principales..."

# Subir archivos principales
echo "Subiendo index.html..."
curl -T "index.html" "ftp://${FTP_HOST}/${FTP_PATH}" --user "${FTP_USER}:${FTP_PASS}"
echo "Subiendo extinction_story.html..."
curl -T "extinction_story.html" "ftp://${FTP_HOST}/${FTP_PATH}" --user "${FTP_USER}:${FTP_PASS}"

# Subir CSS
echo "Subiendo CSS..."
curl --ftp-create-dirs -T "css/style.css" "ftp://${FTP_HOST}/${FTP_PATH}css/" --user "${FTP_USER}:${FTP_PASS}"

# Subir JS
echo "Subiendo JS..."
curl --ftp-create-dirs -T "js/app.js" "ftp://${FTP_HOST}/${FTP_PATH}js/" --user "${FTP_USER}:${FTP_PASS}"
curl --ftp-create-dirs -T "js/story.js" "ftp://${FTP_HOST}/${FTP_PATH}js/" --user "${FTP_USER}:${FTP_PASS}"

# Subir data JSON
echo "Subiendo datos JSON..."
for file in data/*.json; do
    filename=$(basename "$file")
    curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}data/" --user "${FTP_USER}:${FTP_PASS}"
    echo "  ✓ $filename"
done

# Subir imágenes de assets/images
echo "Subiendo imágenes de dinosaurios..."
for file in assets/images/*.png assets/images/*.svg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}assets/images/" --user "${FTP_USER}:${FTP_PASS}"
        echo "  ✓ $filename"
    fi
done

# Subir iconos
echo "Subiendo iconos..."
for file in assets/icons/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}assets/icons/" --user "${FTP_USER}:${FTP_PASS}"
        echo "  ✓ $filename"
    fi
done

# Subir sonidos
echo "Subiendo sonidos..."
for file in sounds/*.mp3; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}sounds/" --user "${FTP_USER}:${FTP_PASS}"
        echo "  ✓ $filename"
    fi
done

# Subir imagenes (mapa y otros)
echo "Subiendo carpeta imagenes..."
for file in imagenes/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}imagenes/" --user "${FTP_USER}:${FTP_PASS}"
        echo "  ✓ $filename"
    fi
done

# Subir cuentos (PDFs)
echo "Subiendo cuentos..."
for file in cuentos/*.pdf; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}cuentos/" --user "${FTP_USER}:${FTP_PASS}"
        echo "  ✓ $filename"
    fi
done

# Subir carpeta dinos_colorear
echo "Subiendo carpeta dinos_colorear..."
for file in dinos_colorear/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        curl --ftp-create-dirs -T "$file" "ftp://${FTP_HOST}/${FTP_PATH}dinos_colorear/" --user "${FTP_USER}:${FTP_PASS}"
        echo "  ✓ $filename"
    fi
done

echo ""
echo "✅ SUBIDA COMPLETADA!"
echo "🌐 Ver en: https://iasolutionspro.es/dinos/"
