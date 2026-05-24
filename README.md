# 🛒 Digital Store - E-commerce Full-Stack

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

Um projeto full-stack para uma loja virtual (e-commerce) chamado **Digital Store**, focado na venda de tênis, roupas e acessórios esportivos. O projeto apresenta um design moderno e responsivo, focado na experiência do usuário e na organização modular do código, acompanhado de uma API RESTful para gerenciar usuários, autenticação e dados.

Este projeto também faz parte de uma **Atividade Avaliativa em Interação Humano-Computador (IHC)**, focada no Desenvolvimento, Avaliação e Redesign de Aplicações Web utilizando o **Modelo DECIDE**.

---

## 📑 Índice
- [Avaliação de IHC e Redesign](#-avaliação-de-ihc-e-redesign)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)

---

## 🔍 Avaliação de IHC e Redesign

O processo de desenvolvimento desta interface passou por etapas rigorosas de avaliação em IHC:
1. **Desenvolvimento Inicial:** Criação do protótipo contemplando 5 funcionalidades principais (Catálogo, Carrinho, Checkout, Autenticação e Histórico de Pedidos).
2. **Avaliação (Modelo DECIDE):** O projeto foi submetido à avaliação por pares, identificando problemas de usabilidade, clareza e eficiência.
3. **Redesign:** Com base no relatório de avaliação, a interface foi iterada para melhorar a jornada do usuário.
    * **Melhoria Recente:** Implementação de uma **Busca Global Centralizada**. A barra de pesquisa agora redireciona e filtra corretamente os produtos no catálogo a partir de qualquer página, reduzindo a carga cognitiva e facilitando a localização de itens.

---

## 🌟 Funcionalidades

### Frontend
*   **Busca Global Integrada:** Barra de pesquisa em todo o site que redireciona automaticamente para o catálogo filtrando por nome, tipo ou marca do produto.
*   **Design Responsivo e Moderno:** Navegação intuitiva adaptável a qualquer dispositivo (Desktop, Tablet e Mobile).
*   **Apresentação de Produtos:** Carrossel interativo de ofertas, coleções em destaque e listagem de produtos com filtros de categorias e tempo real.
*   **Carrinho de Compras Dinâmico:** Adição, remoção e alteração de quantidade de itens com recálculo automático de subtotais e totais.
*   **Fluxo de Checkout Completo:** Tela de confirmação com seleção de itens do carrinho e abas dinâmicas de opções de pagamento.
*   **Perfil e Histórico de Pedidos:** Área logada (`Meus Pedidos`) com gerenciamento de informações pessoais e endereço de entrega.

### Backend e Segurança
*   **API RESTful:** Construída com Node.js e Express.js para lidar com o fluxo de dados da aplicação.
*   **Banco de Dados Relacional:** Utiliza SQLite3 para persistência de informações de usuários e transações.
*   **Autenticação e Autorização:** Sistema seguro utilizando JWT (JSON Web Tokens) e criptografia de senhas com `bcryptjs`.
*   **Proteção de Rotas:** Configuração de *Rate Limit* e rígido controle de acesso via regras de CORS.

---

## 🚀 Tecnologias Utilizadas

### Front-end
*   **HTML5 & CSS3:** Estruturação semântica e estilização avançada utilizando variáveis CSS.
*   **JavaScript (Vanilla ES Modules):** Lógica modular garantindo máxima performance.
*   **Bootstrap 5 & Swiper JS:** Auxílio responsivo e criação de carrosséis modernos.

### Back-end
*   **Node.js & Express.js:** Ambiente de execução e framework da API.
*   **SQLite3:** Banco de dados relacional embarcado no próprio arquivo.
*   **Bcryptjs & JSON Web Token (JWT):** Segurança, criptografia e persistência de sessões.

---

## 📁 Estrutura do Projeto

A arquitetura do projeto isola e organiza as responsabilidades entre Front e Back-end:

```text
├── database.sqlite         # Arquivo do banco de dados SQLite (criado pelo back)
├── package.json            # Dependências e comandos Node.js
├── public/                 # Imagens gerais de produtos e banners (Assets brutos)
├── src/                    
│   ├── assets/             # Ícones e logos usados no layout (SVG e PNG)
│   ├── css/                # Folhas de estilo modulares divididas por páginas e blocos
│   ├── js/                 # Lógicas JavaScript do projeto (Frontend e Backend)
│   │   ├── server.js       # Arquivo principal da API backend (Express)
│   │   └── page/           # Lógicas específicas de cada página (ex: ProductList.js)
│   └── pages/              # Páginas complementares (Carrinho, Lista, etc.)
├── Homepage.html           # Página principal (Entry point do sistema - Front)
└── README.md               # Documentação do projeto
```

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o **[Node.js](https://nodejs.org/)** instalado.

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SEU_USUARIO/Projeto-Digital-Store.git
   ```

2. **Acesse a pasta raiz do projeto**:
   ```bash
   cd Projeto-Digital-Store
   ```

3. **Instale as dependências do servidor**:
   ```bash
   npm install
   ```

4. **Inicie a API (Servidor Backend)**:
   ```bash
   node src/js/server.js
   ```

5. **Inicie o Front-end**:
   Abra o arquivo raiz `Homepage.html` no seu navegador ou utilize a extensão **Live Server** no VS Code.

---

## 📝 Histórico de Atualizações

*   **Implementação de IHC / Redesign:** Adição de roteamento de busca na barra de pesquisa (redirecionamento com parâmetros na URL e filtros automáticos na lista de produtos).
*   **Backend:** Resolução de problemas de CORS e estabilização completa do fluxo de Autenticação.

---

<p align="center">
  <b>Digital Store</b> foi desenvolvido com foco em performance, organização estrutural e princípios consolidados de Interação Humano-Computador. 🚀
</p>
