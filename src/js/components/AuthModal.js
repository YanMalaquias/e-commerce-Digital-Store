import AuthContext from '../contexts/AuthContext.js';
import eventBus from '../core/EventBus.js';

let activeTab = 'login';
let modalElement = null;
let resetEmail = null;
let resetCode = null;
let modalInitialized = false;  // ✓ Flag para evitar inicialização dupla
let existingListeners = {      // ✓ Rastrear listeners já adicionados
    setupDone: false
};
//cria o elemento do modal
function createModalElement() {
    const modalHTML = `
        <div class="auth-modal-overlay" id="auth-modal-overlay">
            <div class="auth-modal-content">
                <button class="auth-modal-close" id="auth-modal-close">&times;</button>
                
                <div class="auth-modal-tabs">
                    <div class="auth-tab active" data-tab="login">Entrar</div>
                    <div class="auth-tab" data-tab="register">Cadastrar</div>
                    <div class="auth-tab" data-tab="reset">Recuperar Senha</div>
                </div>
                
                <form id="auth-form">
                    <!-- Dynamic fields will be injected here -->
                </form>
                
                <div class="auth-divider">
                    <span>ou entre com</span>
                </div>
                
                <button class="auth-social-btn" id="google-login-btn"><img src="src/assets/Logo Google.svg" alt="Google" onerror="this.src='';this.alt='G'"> Google</button>
                <button class="auth-social-btn" id="facebook-login-btn"><img src="src/assets/Logo Facebook.svg" alt="Facebook" onerror="this.src='';this.alt='F'"> Facebook</button>
            </div>
        </div>
    `;
    //insere o modal no body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalElement = document.getElementById('auth-modal-overlay');
}
//atualiza os campos do formulário baseado na aba ativa
function updateFormFields() {
    const form = document.getElementById('auth-form');
    if (activeTab === 'login') {
        form.innerHTML = `
            <input type="email" id="auth-email" name="email" placeholder="E-mail" autocomplete="email" required>
            <input type="password" id="auth-password" name="password" placeholder="Senha" autocomplete="current-password" required>
            <div class="auth-forgot-password">
                <a href="#" id="forgot-password-link">Esqueci minha senha</a>
            </div>
            <button type="submit" class="auth-submit-btn" id="auth-submit-btn">Acessar Conta</button>
            <div id="auth-error-message" style="color: red; margin-top: 10px; text-align: center;"></div>
        `;
        
        // Adiciona evento ao link de esqueci senha
        document.getElementById('forgot-password-link').addEventListener('click', (e) => {
            e.preventDefault();
            activeTab = 'reset';
            updateTabState();
            updateFormFields();
        });
    } else if (activeTab === 'register') {
        form.innerHTML = `
            <div class="auth-form-row">
                <input type="text" id="auth-firstname" name="firstname" placeholder="Nome" autocomplete="given-name" required>
                <input type="text" id="auth-surname" name="surname" placeholder="Sobrenome" autocomplete="family-name" required>
            </div>
            <input type="email" id="auth-email" name="email" placeholder="E-mail" autocomplete="email" required>
            <input type="password" id="auth-password" name="password" placeholder="Senha" autocomplete="new-password" required>
            <input type="password" id="auth-confirm-password" name="confirmPassword" placeholder="Confirmar Senha" autocomplete="new-password" required>
            <button type="submit" class="auth-submit-btn" id="auth-submit-btn">Criar Minha Conta</button>
            <div id="auth-error-message" style="color: red; margin-top: 10px; text-align: center;"></div>
        `;
    } else if (activeTab === 'reset') {
        form.innerHTML = `
            <input type="email" id="reset-email" name="email" placeholder="E-mail" autocomplete="email" required>
            <button type="button" class="auth-submit-btn" id="send-code-btn">Enviar Código</button>
            <div id="reset-step-2" style="display: none; margin-top: 15px;">
                <input type="text" id="reset-code" name="code" placeholder="Código de recuperação" required>
                <input type="password" id="new-password" name="newPassword" placeholder="Nova Senha" autocomplete="new-password" required>
                <input type="password" id="confirm-new-password" name="confirmNewPassword" placeholder="Confirmar Nova Senha" autocomplete="new-password" required>
                <button type="submit" class="auth-submit-btn" id="auth-submit-btn">Redefinir Senha</button>
            </div>
            <div id="auth-error-message" style="color: red; margin-top: 10px; text-align: center;"></div>
            <div id="auth-success-message" style="color: green; margin-top: 10px; text-align: center;"></div>
        `;
        
        // Adiciona evento para enviar código
        document.getElementById('send-code-btn').addEventListener('click', handleSendResetCode);
    }
}

//atualiza o estado das abas
function updateTabState() {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        if (tab.dataset.tab === activeTab) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}
//auth modal event listeners
function setupModalEventListeners() {
    // ✓ Verificar se já foram adicionados
    if (existingListeners.setupDone) {
        return;
    }
    
    const closeBtn = document.getElementById('auth-modal-close');
    if (!closeBtn) return;  // ✓ Elemento não existe ainda
    
    closeBtn.addEventListener('click', () => AuthContext.closeAuthModal());
//overlay click to close    
    const overlay = document.getElementById('auth-modal-overlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            AuthContext.closeAuthModal();
        }
    });
//tab click event
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            activeTab = e.target.dataset.tab;
            updateTabState();
            updateFormFields();
        });
    });

    const form = document.getElementById('auth-form');
    form.addEventListener('submit', handleAuthSubmit);

    // Adiciona eventos aos botões sociais
    const googleBtn = document.getElementById('google-login-btn');
    const facebookBtn = document.getElementById('facebook-login-btn');
    //google login
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const success = await AuthContext.loginWithGoogle();
            if (success) {
                AuthContext.closeAuthModal();
                window.location.reload();
            }
        });
    }
    //facebook login
    if (facebookBtn) {
        facebookBtn.addEventListener('click', async () => {
            const success = await AuthContext.loginWithFacebook();
            if (success) {
                AuthContext.closeAuthModal();
                window.location.reload();
            }
        });
    }
    
    // ✓ Marcar como setup concluído
    existingListeners.setupDone = true;
}
// SUBMISÃO DO FORMULÁRIO
async function handleAuthSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const errorMsg = document.getElementById('auth-error-message');
    const successMsg = document.getElementById('auth-success-message');
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = '';
    
    // Validações no cliente
    if (activeTab === 'login' || activeTab === 'register') {
        if (!data.email || !data.password) {
            if (errorMsg) errorMsg.textContent = 'Email e senha são obrigatórios';
            return;
        }
        if (data.password.length < 8) {
            if (errorMsg) errorMsg.textContent = 'A senha deve ter no mínimo 8 caracteres';
            return;
        }
    }

    const submitBtn = document.getElementById('auth-submit-btn');
    submitBtn.disabled = true;
//CARREGA DADOS DO FORMULÁRIO
    try {
        let success = false;
        if (activeTab === 'login') {
            success = await AuthContext.login(data.email, data.password);
            if (!success) {
                if (errorMsg) errorMsg.textContent = 'E-mail ou senha inválidos.';
            }
        } else if (activeTab === 'register') {
            if (data.password !== data.confirmPassword) {
                if (errorMsg) errorMsg.textContent = 'As senhas não conferem.';
            } else {
                success = await AuthContext.register(data);
                if (!success) {
                    if (errorMsg) errorMsg.textContent = 'Erro ao cadastrar. E-mail já existe?';
                }
            }
        } else if (activeTab === 'reset') {
            // Redefinição de senha
            if (data.newPassword !== data.confirmNewPassword) {
                if (errorMsg) errorMsg.textContent = 'As senhas não conferem.';
            } else {
                try {
                    const response = await fetch('http://localhost:3001/api/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: resetEmail,
                            code: data.code,
                            newPassword: data.newPassword
                        })
                    });
                    
                    if (response.ok) {
                        success = true;
                        if (successMsg) successMsg.textContent = 'Senha redefinida com sucesso!';
                        setTimeout(() => {
                            activeTab = 'login';
                            updateTabState();
                            updateFormFields();
                        }, 2000);
                    } else {
                        const errorData = await response.json();
                        if (errorMsg) errorMsg.textContent = errorData.message || 'Código inválido ou expirado';
                    }
                } catch (error) {
                    if (errorMsg) errorMsg.textContent = 'Erro ao resetar senha: ' + error.message;
                }
            }
        }
//VERIFICA SE O CADASTRO OU LOGIN FOI BEM SUCEDIDO
        if (success && activeTab !== 'reset') {
            AuthContext.closeAuthModal();
            const state = AuthContext.getAuthState();
            if (state.redirectPath) {
                window.location.href = state.redirectPath;
                AuthContext.setRedirectPath(null);
            } else {
                window.location.reload();
            }
        }
    } catch (err) {
        if (errorMsg) errorMsg.textContent = 'Ocorreu um erro. Tente novamente.';
    } finally {
        submitBtn.disabled = false;
    }
}
//ENVIAR CÓDIGO DE REDEFINIÇÃO DE SENHA
async function handleSendResetCode() {
    const emailInput = document.getElementById('reset-email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    const errorMsg = document.getElementById('auth-error-message');
    const successMsg = document.getElementById('auth-success-message');
    
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = '';
    
    if (!email || !email.includes('@')) {
        if (errorMsg) errorMsg.textContent = 'Por favor, insira um email válido';
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3001/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            if (successMsg) successMsg.textContent = 'Código de reset enviado para seu email!';
            resetEmail = email;
            document.getElementById('reset-step-2').style.display = 'block';
            document.getElementById('send-code-btn').style.display = 'none';
        } else {
            if (errorMsg) errorMsg.textContent = 'Email não encontrado';
        }
    } catch (error) {
        if (errorMsg) errorMsg.textContent = 'Erro ao enviar código: ' + error.message;
    }
}
//RENDERIZA O MODAL DE AUTENTICAÇÃO
function renderAuthModal() {
    const state = AuthContext.getAuthState();
    if (state.isAuthModalOpen) {
        if (!modalElement) {
            createModalElement();
            setupModalEventListeners();
        }
        updateFormFields();
        updateTabState();
        modalElement.style.display = 'flex';
    } else {
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }
}

//INICIALIZA O MODAL DE AUTENTICAÇÃO
export default function initAuthModal() {
    // ✓ Evitar inicialização dupla
    if (modalInitialized) {
        return;
    }
    
    modalInitialized = true;
    
    // ✓ Remover evento anterior se existir (compatibilidade)
    eventBus.unsubscribe?.('auth:modalToggled');
    
    eventBus.subscribe('auth:modalToggled', renderAuthModal);
    
    // Initial check
    renderAuthModal();
}
