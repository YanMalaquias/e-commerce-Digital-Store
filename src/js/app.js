// app.js 
import initAuthModal from './components/AuthModal.js';
import AuthContext from './contexts/AuthContext.js';

// Inicializa o modal de autenticação
try {
    initAuthModal();
} catch (error) {
    console.error('Erro ao inicializar modal de autenticação:', error);
}

// Integração com o Header
const loginButton = document.getElementById('btn-header-auth');
if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        const estadoAtual = AuthContext.getAuthState();
        
        if (estadoAtual.isAuthenticated) {
            if (confirm('Deseja sair da sua conta?')) {
                AuthContext.logout();
                window.location.reload();
            }
        } else {
            AuthContext.openAuthModal();
        }
    });

    // Atualiza o botão baseado no estado
    AuthContext.subscribe((estado) => {
        if (estado.isAuthenticated) {
            loginButton.textContent = `Olá, ${estado.user.firstname}`;
        } else {
            loginButton.textContent = 'Entrar / Cadastrar';
        }
    });

    // Estado inicial
    const estadoInicial = AuthContext.getAuthState();
    if (estadoInicial.isAuthenticated) {
        loginButton.textContent = `Olá, ${estadoInicial.user.firstname}`;
    }
}

// Exporta para uso em outras partes
export { AuthContext };

