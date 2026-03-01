# 🌿 Flora Full-Stack Challenge

Bem-vindo ao repositório do projeto **Flora Full-Stack**. Este projeto consiste em um **Dicionário de Inglês Interativo**, onde os usuários podem buscar palavras, ver seus significados e fonéticas (baseado na Free Dictionary API), além de listar, favoritar e consultar o histórico de palavras visualizadas.

O projeto é dividido em uma **API Back-end** (construída com NestJS que lida com cache e banco relacional) e uma **Aplicação Front-end** (construída com React e Next.js para consumo de interface dinâmica).

Abaixo, você encontrará o guia definitivo de como configurar e rodar o projeto utilizando **Docker**, simplificando totalmente o processo de subir os bancos de dados, redis, servidor back-end e front-end ao mesmo tempo.

---

## ✈️ Aplicação em Produção (AWS)

Você pode testar a versão online do projeto hospedada na AWS através do link abaixo:

🔗 **[Acessar o Flora Full-Stack](http://54.160.61.151:3000/signup)**

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes linguagens, frameworks e ferramentas:

**Back-end:**
- TypeScript / Node.js
- NestJS (Framework modular back-end)
- Prisma ORM (Mapeamento e conexões de Banco de Dados)
- PostgreSQL (Banco de Dados Relacional principal)
- Redis (Gerenciamento de Cache)
- Documentação com Swagger

**Front-end:**
- TypeScript / React
- Next.js (App Router)
- CSS

**Infraestrutura e Ferramentais:**
- Docker & Docker Compose (Containerização e Orquestração)
- Git (Controle de versionamento utilizando)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes componentes instalados na sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🚀 Como Iniciar Automaticamente (via Docker)

O `docker-compose` está configurado para instanciar e gerenciar todo o ecossistema da aplicação:
- `db_flora` (PostgreSQL de Banco de Dados relacional)
- `redis_flora` (Redis para Cache/Controle de filas)
- `api_flora` (NestJS Back-end rodando na porta 8000)
- `web_flora` (Next.js Front-end rodando na porta 3000)

### 1. Construir e Subir os Containers
Abra o seu terminal na raiz do projeto (onde está localizado o arquivo `docker-compose.yml`) e execute o seguinte comando:

```bash
docker-compose up --build
```

**Pronto! Apenas isso!** 🎉
Sua aplicação vai baixar as dependências, iniciar o banco de dados, aplicar o `prisma db push` automaticamente e até mesmo realizar a inserção dos dados iniciais (Seed) na primeira execução. Tudo já está orquestrado no `docker-compose.yml`.

### 2. Acessando a Aplicação e a API

Depois de rodar o comando acima e aguardar alguns segundos para que os containers subam e o seed acabe de rodar, seu sistema estará 100% de pé e disponível:

- **Site (Front-end):** Acesse através do seu navegador em [http://localhost:3000](http://localhost:3000)
- **API (Back-end):** Responde em [http://localhost:8000](http://localhost:8000)
- **Documentação Swagger:** Está disponível em [http://localhost:8000/docs](http://localhost:8000/docs)

---


## ⚙️ Variáveis de Ambiente (Opcional - Uso sem Docker Compose)

O projeto já está pré-configurado para rodar perfeitamente no Docker através do arquivo `docker-compose.yml`. Ele é encarregado de injetar as variáveis de ambiente necessárias diretamente nos containers da API e do Front-end.

Caso você decida rodar a aplicação fora do Docker ou precise ajustar algo localmente, você deve criar os arquivos de ambiente em suas respectivas pastas baseando-se nas chaves abaixo:

### 1. Back-end (`back-end/.env`)
> **Nota no Docker:** O arquivo `docker-compose.yml` substitui automaticamente o `localhost` pelos nomes reais e persistentes dos containers da rede interna (`db_flora` e `redis_flora`), então você não precisa se preocupar com isso se usar o Docker!
Crie um arquivo `.env` dentro da pasta `back-end`:
```env
DATABASE_URL="postgresql://user_flora:1234_flora@localhost:5432/flora_db?schema=public"
JWT_SECRET="super-secret-key-flora"
REDIS_HOST="localhost"
REDIS_PORT=6379
PORT=8000
```


### 2. Front-end (`front-end/.env.local` ou `front-end/.env`)
> Como o Next.js lida com essas chaves no navegador, ela sempre apontará para o `localhost` que a API irá expor em sua máquina hospedeira.

Crie um arquivo `.env.local` (ou simplesmente `.env`) dentro da pasta `front-end`:
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```