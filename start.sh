#!/bin/bash

# Script de inicialização do FIPE Analytics
echo "🚀 Iniciando FIPE Analytics..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js 16+ primeiro.${NC}"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js versão 16+ é necessária. Versão atual: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"

# Verificar se as dependências do backend estão instaladas
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências do backend...${NC}"
    npm install
fi

# Verificar se as dependências do frontend estão instaladas
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências do frontend...${NC}"
    cd frontend
    npm install
    cd ..
fi

# Verificar se as portas estão disponíveis
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Porta 3000 já está em uso. Tentando parar processo...${NC}"
    pkill -f "node.*server.js" || true
    sleep 2
fi

if check_port 5173; then
    echo -e "${YELLOW}⚠️  Porta 5173 já está em uso. Tentando parar processo...${NC}"
    pkill -f "vite" || true
    sleep 2
fi

# Iniciar backend
echo -e "${BLUE}🔧 Iniciando backend na porta 3000...${NC}"
npm run dev &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Testar se backend está funcionando
if curl -s http://localhost:3000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend iniciado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar backend${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Iniciar frontend
echo -e "${BLUE}🎨 Iniciando frontend na porta 5173...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Aguardar frontend inicializar
sleep 5

# Testar se frontend está funcionando
if curl -s -I http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Frontend iniciado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar frontend${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 FIPE Analytics iniciado com sucesso!${NC}"
echo ""
echo -e "${BLUE}📍 URLs disponíveis:${NC}"
echo -e "   Frontend: ${YELLOW}http://localhost:5173${NC}"
echo -e "   Backend:  ${YELLOW}http://localhost:3000${NC}"
echo -e "   API Docs: ${YELLOW}http://localhost:3000/api-docs${NC}"
echo ""
echo -e "${BLUE}🛑 Para parar os serviços:${NC}"
echo -e "   Pressione ${YELLOW}Ctrl+C${NC} ou execute: ${YELLOW}./stop.sh${NC}"
echo ""

# Salvar PIDs para script de parada
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Aguardar interrupção
trap 'echo -e "\n${YELLOW}🛑 Parando serviços...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; rm -f .backend.pid .frontend.pid; exit 0' INT

# Manter script rodando
wait 