#!/bin/bash

# Script de teste do FIPE Analytics
echo "🧪 Testando FIPE Analytics..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar URL
test_url() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" > /dev/null; then
        echo -e "${GREEN}✅ $name está funcionando${NC}"
        return 0
    else
        echo -e "${RED}❌ $name não está respondendo${NC}"
        return 1
    fi
}

# Função para testar API endpoint
test_api() {
    local endpoint=$1
    local name=$2
    
    local response=$(curl -s -w "%{http_code}" "http://localhost:3000$endpoint")
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ API $name está funcionando (HTTP $http_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ API $name falhou (HTTP $http_code)${NC}"
        return 1
    fi
}

echo ""
echo -e "${BLUE}🔧 Testando Backend...${NC}"

# Testar backend básico
test_url "http://localhost:3000" "Backend principal"
test_api "/health" "Health Check"
test_api "/api-docs" "Documentação"

echo ""
echo -e "${BLUE}🎨 Testando Frontend...${NC}"

# Testar frontend
test_url "http://localhost:5173" "Frontend principal"

# Testar se o HTML contém o título correto
if curl -s http://localhost:5173 | grep -q "FIPE Analytics"; then
    echo -e "${GREEN}✅ Título da página está correto${NC}"
else
    echo -e "${YELLOW}⚠️  Título da página pode não estar atualizado${NC}"
fi

echo ""
echo -e "${BLUE}🌐 URLs Disponíveis:${NC}"
echo -e "   Frontend: ${YELLOW}http://localhost:5173${NC}"
echo -e "   Backend:  ${YELLOW}http://localhost:3000${NC}"
echo -e "   API Docs: ${YELLOW}http://localhost:3000/api-docs${NC}"
echo -e "   Health:   ${YELLOW}http://localhost:3000/health${NC}"

echo ""
echo -e "${GREEN}🎉 Teste concluído!${NC}"
echo -e "${BLUE}💡 Dica: Abra ${YELLOW}http://localhost:5173${NC} ${BLUE}no seu navegador${NC}" 