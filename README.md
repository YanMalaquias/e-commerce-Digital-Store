# 🛒 Digital Store - E-commerce Full-Stack

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

Um projeto full-stack para uma loja virtual (e-commerce) chamado **Digital Store**, focado na venda de tênis, roupas e acessórios esportivos. O projeto apresenta um design moderno e responsivo, focado na experiência do usuário e na organização modular do código, agora acompanhado de uma robusta API RESTful para gerenciar usuários, autenticação e dados via banco de dados.

---

## 📑 Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)

---

## 🌟 Funcionalidades

### Frontend
*   **Design Responsivo e Moderno:** Navegação intuitiva com barra de pesquisa, links rápidos e design limpo adaptável a qualquer dispositivo (Desktop, Tablet e Mobile).
*   **Apresentação de Produtos:** Carrossel interativo de ofertas, coleções em destaque e listagem de produtos com filtro de busca.
*   **Carrinho de Compras Dinâmico:** Adição, remoção e alteração de quantidade de itens com recálculo automático de subtotais e totais.
*   **Fluxo de Checkout Completo:** Tela de confirmação com seleção de itens do carrinho e abas dinâmicas de opções de pagamento (Cartão de Crédito, Pix e Boleto).
*   **Perfil e Histórico de Pedidos:** Área logada (`Meus Pedidos`) com gerenciamento de informações pessoais e endereço de entrega, além da listagem em tempo real de pedidos realizados.

### Backend e Segurança
*   **API RESTful:** Construída com Node.js e Express.js para lidar com o fluxo de dados da aplicação.
*   **Banco de Dados Relacional:** Utiliza SQLite3 para persistência de informações de usuários e transações da loja.
*   **Autenticação e Autorização:** Sistema seguro utilizando JWT (JSON Web Tokens) e criptografia de senhas com `bcryptjs`.
*   **Proteção de Rotas:** Configuração de *Rate Limit* para evitar abusos (ex: proteção contra ataques de força bruta em rotas de login) e rígido controle de acesso via regras de CORS.

---

## 🚀 Tecnologias Utilizadas

### Front-end
*   **HTML5 & CSS3:** Estruturação semântica e estilização avançada utilizando variáveis CSS e fontes personalizadas (Inter via Google Fonts).
*   **JavaScript (Vanilla ES Modules):** Lógica modular garantindo máxima performance.
*   **Bootstrap 5:** Framework CSS auxiliar na estabilidade dos componentes responsivos.
*   **Swiper JS:** Biblioteca leve para criação de carrosséis modernos.

### Back-end
*   **Node.js & Express.js:** Ambiente de execução e framework da API.
*   **SQLite3:** Banco de dados relacional embarcado no próprio arquivo, não necessitando setups complexos de SGBDs de terceiros.
*   **Bcryptjs:** Utilizado na geração de hash criptografado das senhas de usuários.
*   **JSON Web Token (JWT):** Segurança robusta baseada em tokens para persistir sessões de acesso do usuário.
*   **Dotenv:** Gerenciamento local de variáveis de ambiente.

---

## 📁 Estrutura do Projeto

A arquitetura do projeto isola e organiza as responsabilidades entre Front e Back-end:

```text
├── database.sqlite         # Arquivo do banco de dados SQLite (criado pelo back)
├── package.json            # Dependências e comandos Node.js
├── package-lock.json       # Tranca as versões exatas das dependências npm
├── public/                 # Imagens gerais de produtos e banners (Assets brutos)
├── src/                    
│   ├── assets/             # Ícones e logos usados no layout (SVG e PNG)
│   ├── css/                # Folhas de estilo modulares divididas por páginas e blocos
│   ├── js/                 # Lógicas JavaScript do projeto
│   │   ├── server.js       # Arquivo principal da API backend (Express)
│   │   ├── database.js     # Configuração e tabelas do SQLite3
│   │   ├── components/     # Componentes de UI dinâmica do frontend
│   │   ├── contexts/       # Lógicas de estado (ex: Sessão de Login, Carrinho)
│   │   ├── core/           # Núcleo da arquitetura (EventBus, Storage local)
│   │   └── utils/          # Funções utilitárias de formatação e requests HTTP
│   └── pages/              # Páginas complementares (Carrinho, Lista, etc.)
├── Homepage.html           # Página principal (Entry point do sistema - Front)
└── README.md               # Você está aqui - Documentação
```

---

## 🛠️ Como Executar o Projeto Localmente

Por possuir arquitetura *Full-Stack*, o funcionamento completo do fluxo de e-commerce necessita que a API esteja executando no ambiente Node para responder às requisições do Front-end.

### Pré-requisitos
Certifique-se de ter o **[Node.js](https://nodejs.org/)** instalado.

### Passo a Passo

1. **Clone o repositório** para a sua máquina local:
   ```bash
   git clone https://github.com/SEU_USUARIO/Projeto-Digital-Store.git
   ```

2. **Acesse a pasta raiz do projeto**:
   ```bash
   cd Projeto-Digital-Store
   ```

3. **Instale as dependências do servidor** utilizando NPM:
   ```bash
   npm install
   ```

4. **Inicie a API (Servidor Backend)**:
   ```bash
   node src/js/server.js
   ```
   *(A API subirá conectando-se ao `database.sqlite` e aguardará as requisições do frontend, geralmente via porta `3001` ou a configurada no `.env`)*

5. **Inicie o Front-end e acesse a Loja**:
   Para visualizar a interface em conjunto com as requisições API simuladas:
   - Utilizando o **VS Code**, instale a extensão **Live Server**.
   - Abra o arquivo raiz `Homepage.html` no seu editor.
   - Clique com o botão direito no código ou no arquivo e selecione **"Open with Live Server"**.
   - O projeto será aberto automaticamente no seu navegador padrão (geralmente sob `http://127.0.0.1:5500`).

---

<p align="center">
  <b>Digital Store</b> foi desenvolvido com foco em performance, organização estrutural e escalabilidade modular. 🚀
</p>
