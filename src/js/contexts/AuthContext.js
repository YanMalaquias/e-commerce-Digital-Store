import eventBus from '../core/EventBus.js';
import Storage from '../core/Storage.js';

// 🛑  URL do  Render 
const API_BASE_URL = 'https://e-commerce-digital-store.onrender.com'; 

//contexto de autenticação
class AuthContextClass {
    constructor() {
        this.state = {
            isAuthenticated: false,
            user: null,
            isAuthModalOpen: false,
            redirectPath: null
        };
        this.init();
    }
//inicializa o contexto
    init() {
        const session = Storage.get('auth_session');
        if (session && session.isLoggedIn) {
            this.state.isAuthenticated = true;
            this.state.user = session.user;
        }
    }
//efetua login
    async login(email, password) {
        if (!email || !password) {
            console.error('Email e senha são obrigatórios');
            return false;
        }
//valida o formato do email
        try {
            // Alterado para usar a URL do Render dinamicamente
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha: password })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Erro de login:', error.message);
                return false;
            }
// Armazena o token e as informações do usuário na sessão
            const data = await response.json();
            
            Storage.set('auth_token', data.token);
            
            const userWithoutPassword = { ...data.user };
            delete userWithoutPassword.senha_hash;
            
            this.state.isAuthenticated = true;
            this.state.user = userWithoutPassword;
            
            Storage.set('auth_session', {
                user: userWithoutPassword,
                isLoggedIn: true,
                loginAt: new Date().toISOString()
            });
            // Publica o evento de login para que outros componentes possam reagir a ele
            eventBus.publish('auth:login', { user: userWithoutPassword });
            this.notifySubscribers();
            return true;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return false;
        }
    }
//registra um novo usuário
    async register(userData) {
        if (userData.password !== userData.confirmPassword) {
            return false;
        }

        try {
            // Alterado para usar a URL do Render dinamicamente
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: userData.firstname,
                    surname: userData.surname,
                    email: userData.email,
                    senha: userData.password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Erro de registro:', error.message);
                return false;
            }

            const data = await response.json();
            
            Storage.set('auth_token', data.token);
            
            return this.login(userData.email, userData.password);
        } catch (error) {
            console.error('Erro ao registrar:', error);
            return false;
        }
    }
//desloga o usuário
    logout() {
        this.state.isAuthenticated = false;
        this.state.user = null;
        Storage.remove('auth_session');
        eventBus.publish('auth:logout', null);
        this.notifySubscribers();
    }

//retorna todos os usuários
    getUsers() {
        return Storage.get('auth_users') || [];
    }

//reseta a senha do usuário
    async resetPassword(email, newPassword) {
        const users = Storage.get('auth_users') || [];
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex === -1) {
            return false;
        }

        users[userIndex].password = newPassword;
        return Storage.set('auth_users', users);
    }

    async loginWithGoogle() {
        // Simulação de login Google
        const googleUser = {
            id: Date.now(),
            firstname: 'Google',
            surname: 'User',
            email: 'google.user@gmail.com',
            provider: 'google',
            createdAt: new Date().toISOString()
        };
//verifica se o usuário já existe
        const users = Storage.get('auth_users') || [];
        const existingUser = users.find(u => u.email === googleUser.email);
        //se não existir, adiciona o usuário
        if (!existingUser) {
            users.push(googleUser);
            Storage.set('auth_users', users);
        }
//define o estado de autenticado como true
        this.state.isAuthenticated = true;
        const userWithoutPassword = { ...googleUser };
        delete userWithoutPassword.password;
        this.state.user = userWithoutPassword;
        //salva a sessão
        Storage.set('auth_session', {
            user: userWithoutPassword,
            isLoggedIn: true,
            loginAt: new Date().toISOString()
        });
        //publica o evento de login
        eventBus.publish('auth:login', { user: userWithoutPassword });
        this.notifySubscribers();
        return true;
    }

    async loginWithFacebook() {
        // Simulação de login Facebook
        const facebookUser = {
            id: Date.now(),
            firstname: 'Facebook',
            surname: 'User',
            email: 'facebook.user@facebook.com',
            provider: 'facebook',
            createdAt: new Date().toISOString()
        };
//verifica se o usuário já existe
        const users = Storage.get('auth_users') || [];
        const existingUser = users.find(u => u.email === facebookUser.email);
        
        if (!existingUser) {
            users.push(facebookUser);
            Storage.set('auth_users', users);
        }
//define o estado de autenticado como true
        this.state.isAuthenticated = true;
        const userWithoutPassword = { ...facebookUser };
        delete userWithoutPassword.password;
        this.state.user = userWithoutPassword;
        
        Storage.set('auth_session', {
            user: userWithoutPassword,
            isLoggedIn: true,
            loginAt: new Date().toISOString()
        });
        //publica o evento de login
        eventBus.publish('auth:login', { user: userWithoutPassword });
        this.notifySubscribers();
        return true;
    }
    //retorna o estado atual da autenticação
    getAuthState() {
        return { ...this.state };
    }

    //registra um callback para ser chamado quando o estado de autenticação mudar
    subscribe(callback) {
        eventBus.subscribe('auth:stateChanged', callback);
    }

    //notifica todos os subscribers sobre a mudança de estado
    notifySubscribers() {
        eventBus.publish('auth:stateChanged', this.getAuthState());
    }

    //abre o modal de autenticação
    openAuthModal() {
        this.state.isAuthModalOpen = true;
        eventBus.publish('auth:modalToggled', true);
        this.notifySubscribers();
    }

    //fecha o modal de autenticação
    closeAuthModal() {
        this.state.isAuthModalOpen = false;
        eventBus.publish('auth:modalToggled', false);
        this.notifySubscribers();
    }

    //define o caminho para redirecionar após o login
    setRedirectPath(path) {
        this.state.redirectPath = path;
        this.notifySubscribers();
    }
}

const AuthContext = new AuthContextClass();
export default AuthContext;