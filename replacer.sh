#!/bin/bash
set -e

# Lectura de parámetros de entrada

PARAMS=""

while (("$#")); do
    case "$1" in
    --backendRepositoryName)
        BACKEND_REPOSITORY_NAME=$2
        shift
        ;;
    --backendRepositoryTag)
        BACKEND_REPOSITORY_TAG=$2
        shift 2
        ;;
    --frontendRepositoryName)
        FRONTEND_REPOSITORY_NAME=$2
        shift 2
        ;;
    --frontendRepositoryTag)
        FRONTEND_REPOSITORY_TAG=$2
        shift 2
        ;;
    --outputFilename)
        OUTPUTFILENAME=$2
        shift 2
        ;;
    --inputFilename)
        INPUTFILENAME=$2
        shift 2
        ;;
    -* | --*=) # Flags no soportados
        echo "Error: Bandera no soportada $1" >&2
        exit 1
        ;;
    *) # Preserva argumentos posicionales
        PARAMS="$PARAMS $1"
        shift
        ;;
    esac
done

# Si falta algún parámetro de entrada, finaliza la ejecución del programa...

SALIR=false

[ -z "$BACKEND_REPOSITORY_NAME" ] && echo "Error: falta definir la bandera --backendRepositoryName" && SALIR=true
[ -z "$BACKEND_REPOSITORY_TAG" ] && echo "Error: falta definir la bandera --backendRepositoryTag" && SALIR=true
[ -z "$FRONTEND_REPOSITORY_NAME" ] && echo "Error: falta definir la bandera --frontendRepositoryName" && SALIR=true
[ -z "$FRONTEND_REPOSITORY_TAG" ] && echo "Error: falta definir la bandera --frontendRepositoryTag" && SALIR=true
[ "$SALIR" = true ] && exit 1

[ -z "$INPUTFILENAME" ] && INPUTFILENAME="Dockerrun.aws.template.json"
[ ! -f "$INPUTFILENAME" ] && echo "Error: la plantilla definida con la bandera --inputFilename no existe" && SALIR=true
[ -z "$OUTPUTFILENAME" ] && OUTPUTFILENAME="Dockerrun.aws.json"
[ "$SALIR" = true ] && exit 1

# Estableciendo valores por defecto

sed "s/%BACKEND_REPOSITORY_NAME%/${BACKEND_REPOSITORY_NAME}/g" "${INPUTFILENAME}" |
    sed -e "s/%FRONTEND_REPOSITORY_NAME%/${FRONTEND_REPOSITORY_NAME}/g" |
    sed -e "s/%BACKEND_REPOSITORY_TAG%/${BACKEND_REPOSITORY_TAG}/g" |
    sed -e "s/%FRONTEND_REPOSITORY_TAG%/${FRONTEND_REPOSITORY_TAG}/g" > "${OUTPUTFILENAME}"