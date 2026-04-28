# Gestão Agro - Frontend

Sistema web para gestão de propriedades rurais, produtores, rebanhos e relatórios agrícolas.

## 📋 Sumário

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Componentes Principais](#componentes-principais)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

## ✨ Características

- **Gestão de Produtores Rurais**: Cadastro, edição e exclusão de produtores com suporte a CPF/CNPJ
- **Gestão de Propriedades**: Registro de propriedades rurais com localização, área e dados de registro estadual
- **Gestão de Rebanhos**: Controle de animais e espécies em cada propriedade
- **Relatórios**: Geração de relatórios sobre propriedades e rebanhos
- **Interface Responsiva**: Design moderno com Tailwind CSS
- **Componentes UI Premium**: Interface com PrimeVue para melhor UX
- **Validação de Dados**: Máscaras de entrada e validações de formulário
- **Busca e Filtros**: Sistema de busca global e paginação de dados
- **Integração IBGE**: Dados de estados e municípios brasileiros em tempo real

## 🛠 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Bundler e dev server ultrarrápido
- **PrimeVue 4.5.5** - Biblioteca de componentes UI premium
- **Tailwind CSS 4.2** - Utility-first CSS framework
- **Vue Router 4.6** - Roteamento para SPA
- **Axios 1.15** - Cliente HTTP
- **Chart.js 4.5** - Biblioteca de gráficos
- **SweetAlert2 11.26** - Alertas e confirmações estilizadas

## 📦 Pré-requisitos

- Node.js 16.0 ou superior
- pnpm 8.0 ou superior (ou npm/yarn)

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/vinialves34/gestao-agro-frontend
cd gestao-agro-frontend
```

### 2. Instalar dependências

```bash
pnpm install
# ou
npm install
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_IBGE_URL=https://servicodados.ibge.gov.br/api/v1/localidades
```

## 📜 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
pnpm dev
# ou
npm run dev

# Build para produção
pnpm build
# ou
npm run build

# Preview do build de produção
pnpm preview
# ou
npm run preview

# Type-check com Vue TSC (sem emitir arquivos)
pnpm type-check
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Navbar.vue      # Barra de navegação
├── pages/              # Páginas principais da aplicação
│   ├── HerdsPage.vue
│   ├── PropertiesPage.vue
│   ├── RuralProducersPage.vue
│   └── ReportsPage.vue
├── models/             # Interfaces e tipos TypeScript
│   ├── Herd.ts
│   ├── Property.ts
│   ├── RuralProducer.ts
│   └── Specie.ts
├── services/           # Serviços de API e utilitários
│   ├── api.ts         # Configuração de APIs
│   ├── ibge-api.ts    # Integração com IBGE
│   └── interfaces/
│       └── IPaginationData.ts
├── router/             # Configuração de rotas
│   └── index.ts
├── utils/              # Funções utilitárias
│   └── sweetalertUtils.ts
├── App.vue
├── main.ts
└── style.css
```

## 🧩 Componentes Principais

### RuralProducersPage
Gerencia o cadastro de produtores rurais com:
- Busca global
- Formulário de criação/edição
- Validação com máscara de telefone
- Confirmação de exclusão

### PropertiesPage
Gerencia propriedades rurais com:
- Seleção de estado e município via IBGE
- Vinculação com produtor rural
- Dados de área total e inscrição estadual
- Paginação de resultados

### HerdsPage
Controle de rebanhos com informações sobre animais e espécies

### ReportsPage
Geração de relatórios sobre propriedades e rebanhos

## 🔗 Integração com Backend

O projeto se conecta a uma API REST backend. Configure a URL base em `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
```

### Endpoints esperados:

- `GET /api/rural-producers` - Listar produtores
- `POST /api/rural-producers` - Criar produtor
- `PUT /api/rural-producers/:id` - Atualizar produtor
- `DELETE /api/rural-producers/:id` - Deletar produtor
- `GET /api/properties` - Listar propriedades
- `POST /api/properties` - Criar propriedade
- `PUT /api/properties/:id` - Atualizar propriedade
- `DELETE /api/properties/:id` - Deletar propriedade

## 🌐 Integração IBGE

O projeto utiliza a API pública do IBGE para dados de:
- Estados brasileiros
- Municípios por estado

Nenhuma configuração adicional é necessária para esta integração.

## 📝 Exemplo de Uso

### Acessar o desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (Vite default)

### Fluxo típico:

1. Acessar "Produtores Rurais" para cadastrar produtores
2. Ir para "Propriedades" para adicionar propriedades vinculadas a produtores
3. Em "Rebanhos", registrar os animais nas propriedades
4. Gerar relatórios em "Relatórios"

## 🎨 Customização

### Tailwind CSS
Configure em `tailwind.config.js` conforme necessário

### PrimeVue Theme
O tema pode ser alterado em `main.ts`

### TypeScript
Ajuste as configurações em `tsconfig.json`

## 🐛 Troubleshooting

**Problema**: Módulos não encontrados
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Problema**: Porta 5173 já em uso
```bash
pnpm dev -- --port 3000
```

---

**Desenvolvido com ❤️ usando Vue 3 + TypeScript**

