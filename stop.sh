#!/bin/bash

# Script para parar o FIPE Analytics
echo "🛑 Parando FIPE Analytics..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parar processos usando PIDs salvos
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Parando backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
    fi
    rm -f .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Parando frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID
    fi
    rm -f .frontend.pid
fi

# Parar processos por nome (fallback)
echo -e "${YELLOW}Parando processos restantes...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Aguardar um momento
sleep 2

echo -e "${GREEN}✅ FIPE Analytics parado com sucesso!${NC}" 