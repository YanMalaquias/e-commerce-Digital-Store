# 🛒 Digital Store - E-commerce

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

Um projeto completo (Full-stack) para uma loja virtual (e-commerce) chamado **Digital Store**, focado na venda de tênis, roupas e acessórios esportivos. O projeto apresenta um design moderno e responsivo no front-end, complementado por um back-end em Node.js com sistema seguro de autenticação e banco de dados SQLite.

---

## 📑 Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executando o Back-end](#executando-o-back-end)
  - [Executando o Front-end](#executando-o-front-end)
- [API Endpoints](#-api-endpoints)

---

## 🌟 Funcionalidades

### Front-end
*   **Design Responsivo e Moderno:** Navegação intuitiva com barra de pesquisa, links rápidos e design limpo adaptável a qualquer dispositivo.
*   **Apresentação de Produtos:** Carrossel de ofertas, coleções em destaque, listagem com filtros (simulados) e um carrinho com contador dinâmico.
*   **Gerador de Cupons:** Interação de cópia de cupom diretamente para a área de transferência do usuário na aba de Ofertas Especiais.
*   **Gerenciamento de Estado Dinâmico:** Utilização do padrão **Observer** (via EventBus customizado) para atualização fluida da interface baseada no status de login.

### Back-end & Segurança
*   **Sistema Completo de Autenticação:** Login e Cadastro unificados em um modal dinâmico no front-end e processados no back-end.
*   **Segurança com JWT & Bcrypt:** Hashes de senha utilizando `bcryptjs` e sessões seguras com `jsonwebtoken` (JWT).
*   **Proteção de Rotas:** Controle de tráfego com `express-rate-limit` para prevenir ataques de força bruta.
*   **Recuperação de Senha:** Fluxo de envio de código via API e redefinição de senha esquecida.

---

## 🚀 Tecnologias Utilizadas

### Front-end
*   **HTML5 / CSS3:** Estruturação semântica e estilização avançada utilizando variáveis CSS e fontes personalizadas (Inter via Google Fonts).
*   **JavaScript (Vanilla ES Modules):** Lógica modular sem frameworks, garantindo performance e controle total.
*   **Swiper JS:** Biblioteca para criação de carrosséis modernos e responsivos.

### Back-end
*   **Node.js / Express:** Criação da API RESTful para comunicação e gestão da lógica de negócios.
*   **SQLite3:** Banco de dados relacional leve para persistência de dados de usuários de forma simplificada.
*   **Bcrypt.js & JWT:** Tecnologias responsáveis pela segurança e autenticação robusta das sessões.

---

## 📁 Estrutura do Projeto

A arquitetura do projeto separa claramente as responsabilidades de cliente e servidor, com a parte back-end integrada aos scripts principais:

```text
├── public/                 # Imagens e assets estáticos gerais
├── src/                    
│   ├── assets/             # Ícones e imagens vetorizadas
│   ├── css/                # Folhas de estilo modulares
│   ├── js/                 # Scripts do projeto
│   │   ├── components/     # Componentes de UI dinâmica (ex: AuthModal)
│   │   ├── contexts/       # Lógicas de contexto de estado (ex: AuthContext)
│   │   ├── core/           # Núcleo da aplicação (EventBus, Storage local)
│   │   ├── config/         # Configurações globais e URLs da API
│   │   ├── server.js       # Ponto de entrada do Back-end (API Express)
│   │   └── database.js     # Configuração de conexão do SQLite
│   └── pages/              # Páginas secundárias (Carrinho, Produto, etc.)
├── database.sqlite         # Arquivo local do banco de dados SQLite
├── package.json            # Dependências do projeto (Node.js)
├── Homepage.html           # Página principal do E-commerce
└── README.md               # Documentação do projeto
```

---

## 🛠️ Como Executar o Projeto Localmente

Devido à utilização de **ES Modules** no front-end e de uma **API em Node.js** no back-end, são necessárias duas etapas independentes para executar o projeto completamente.

### Pré-requisitos
- Ter o **Node.js** (v18+ recomendado) instalado na máquina.
- Um editor de código de sua preferência (ex: **VS Code**).

### Instalação

1. Clone o repositório para o seu ambiente local:
```bash
git clone https://github.com/SEU_USUARIO/Projeto-Digital-Store.git
```
2. Acesse o diretório do projeto:
```bash
cd Projeto-Digital-Store
```
3. Instale as dependências do Node.js:
```bash
npm install
```

### Executando o Back-end (API)

O back-end é responsável por gerenciar a autenticação e as requisições ao banco de dados SQLite.

1. Inicie o servidor Node.js com o seguinte comando:
```bash
node src/js/server.js
```
*O servidor estará rodando na porta `3001` (ou na porta definida por sua variável de ambiente).*

### Executando o Front-end

Para que os módulos do JavaScript (`<script type="module">`) funcionem e não sejam bloqueados pelas políticas de CORS, é obrigatório rodar o front-end utilizando um servidor de desenvolvimento local.

**Usando a extensão Live Server no VS Code:**
1. Abra o arquivo `Homepage.html` no VS Code.
2. Clique com o botão direito sobre o arquivo e selecione **"Open with Live Server"**.
3. O projeto abrirá no seu navegador, usualmente na porta `3000` ou `5500`.

*Nota: O Back-end está configurado para aceitar requisições de `http://localhost:3000` por padrão. Se o seu Live Server abrir em uma porta diferente (como `5500`), defina uma variável de ambiente `CORS_ORIGIN=http://localhost:5500` antes de iniciar o Node.js.*

---

## 🔌 API Endpoints

A API local roda, por padrão, na base `http://localhost:3001/api`.

| Método | Endpoint | Descrição |
|--------|----------------------|---------------------------------------------|
| `POST` | `/register`          | Cadastra um novo usuário no banco de dados. |
| `POST` | `/login`             | Autentica um usuário e retorna um token JWT.|
| `POST` | `/forgot-password`   | Envia um código para redefinição de senha.  |
| `POST` | `/reset-password`    | Atualiza a senha usando o código enviado.   |

---

<p align="center">
  <b>Digital Store</b> foi desenvolvido com foco em performance, organização estrutural e um design limpo. 🚀
</p>
