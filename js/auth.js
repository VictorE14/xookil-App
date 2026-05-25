let currentUser = null;
let authCallbacks = [];

function onAuthChange(callback) {
    authCallbacks.push(callback);
}

function notifyAuthChange() {
    authCallbacks.forEach(cb => cb(currentUser));
}

function clearAllSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessibilityMode');
    sessionStorage.clear();
}

async function checkAuth() {
    // Limpiar todo al iniciar - siempre empezar en login
    clearAllSession();
    currentUser = null;
    notifyAuthChange();
    return false;
}

async function login(email, password) {
    const result = await loginUserLocal(email, password);
    
    if (result.success && result.user) {
        currentUser = result.user;
        saveSession(currentUser);
        notifyAuthChange();
        showToastMessage(`¡Bienvenido! ${result.user.full_name || result.user.email}`);
        return true;
    } else {
        showToastMessage(result.error || 'Error al iniciar sesión', true);
        return false;
    }
}

async function register(email, password, fullName) {
    const result = await registerUserLocal(email, password, fullName);
    
    if (result.success) {
        showToastMessage('✅ Registro exitoso. Ya puedes iniciar sesión.');
        return true;
    } else {
        showToastMessage(result.error || 'Error al registrarse', true);
        return false;
    }
}

async function logout() {
    clearAllSession();
    currentUser = null;
    notifyAuthChange();
    showToastMessage('Sesión cerrada');
}

function getCurrentUser() {
    return currentUser;
}

function isAuthenticated() {
    return currentUser !== null;
}

function showToastMessage(message, isError = false) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.backgroundColor = isError ? '#dc3545' : '#1a1a2e';
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.backgroundColor = '#1a1a2e';
        }, 3000);
    }
}

// No llamar a checkAuth aquí