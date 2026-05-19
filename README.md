# 🛒 Digital Store - E-commerce

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

Um projeto de front-end para uma loja virtual (e-commerce) chamado **Digital Store**, focado na venda de tênis, roupas e acessórios esportivos. O projeto apresenta um design moderno e responsivo, focado na experiência do usuário e na organização modular do código.

---

## 📑 Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)

---

## 🌟 Funcionalidades

*   **Design Responsivo e Moderno:** Navegação intuitiva com barra de pesquisa, links rápidos e design limpo adaptável a qualquer dispositivo (Desktop, Tablet e Mobile).
*   **Apresentação de Produtos:** Carrossel interativo de ofertas, coleções em destaque, listagem com filtros (simulados visualmente) e um carrinho com contador dinâmico.
*   **Gerador de Cupons:** Interação de cópia de cupom diretamente para a área de transferência do usuário na aba de Ofertas Especiais.
*   **Gerenciamento de Estado Dinâmico:** Utilização do padrão **Observer** (via EventBus customizado) para atualização fluida da interface e manipulação de modais.
*   **Sistema de Autenticação Visual:** Modais dinâmicos para Login e Cadastro.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido focado em base sólida e sem o uso de frameworks complexos para a interface:

*   **HTML5:** Estruturação semântica de todas as páginas.
*   **CSS3:** Estilização avançada utilizando variáveis CSS e fontes personalizadas (Inter via Google Fonts), com arquivos modulares para cada página/componente.
*   **JavaScript (Vanilla ES Modules):** Lógica modular dividida por responsabilidades, garantindo performance e controle total da aplicação.
*   **Swiper JS:** Biblioteca leve e poderosa para a criação de carrosséis modernos e responsivos.

---

## 📁 Estrutura do Projeto

A arquitetura do projeto separa claramente as responsabilidades de estilos, scripts e assets:

```text
├── public/                 # Imagens gerais de produtos e banners
├── src/                    
│   ├── assets/             # Ícones e logos (SVG e PNG)
│   ├── css/                # Folhas de estilo modulares por página/componente
│   ├── js/                 # Scripts do projeto organizados em módulos
│   │   ├── components/     # Componentes de UI dinâmica (ex: AuthModal, ProductCard)
│   │   ├── contexts/       # Lógicas de estado (ex: CartContext, AuthContext)
│   │   ├── core/           # Núcleo da aplicação (EventBus, Storage)
│   │   └── utils/          # Funções utilitárias de validação e formatação
│   └── pages/              # Páginas secundárias (Carrinho, Lista de Produtos, etc.)
├── Homepage.html           # Página principal (Entry point)
└── README.md               # Documentação do projeto
```

---

## 🛠️ Como Executar o Projeto Localmente

Devido à utilização de **ES Modules** no JavaScript (`<script type="module">`), é necessário rodar o projeto através de um servidor de desenvolvimento local para evitar bloqueios de CORS pelo navegador.

### Passo a Passo

1. **Clone o repositório** para a sua máquina local:
   ```bash
   git clone https://github.com/SEU_USUARIO/Projeto-Digital-Store.git
   ```

2. **Acesse a pasta do projeto**:
   ```bash
   cd Projeto-Digital-Store
   ```

3. **Inicie um servidor local**. A forma mais recomendada é através do **VS Code**:
   - Instale a extensão **Live Server** no Visual Studio Code.
   - Abra o arquivo `Homepage.html`.
   - Clique com o botão direito no código ou no arquivo e selecione **"Open with Live Server"**.
   - O projeto será aberto automaticamente no seu navegador padrão (geralmente em `http://127.0.0.1:5500`).

*(Alternativamente, você pode usar ferramentas como `npx http-server` ou `python -m http.server` caso possua Node.js ou Python instalados na máquina).*

---

<p align="center">
  <b>Digital Store</b> foi desenvolvido com foco em performance, organização estrutural e um design limpo. 🚀
</p>
