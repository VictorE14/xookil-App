// ============================================
// CONFIGURACIÓN DE SUPABASE
// ============================================
const SUPABASE_URL = 'https://hakkvarftjswhjbmmnbc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhha2t2YXJmdGpzd2hqYm1tbmJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODcxODA2MCwiZXhwIjoyMDk0Mjk0MDYwfQ.VJCnTDp0rq2OtGImteZ7lVrCW0kPznp5B5mbIFU04hc';

let supabaseClient = null;

function initSupabase() {
    if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase conectado');
    }
    return supabaseClient;
}

function getSupabase() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

async function registerUserLocal(email, password, fullName) {
    const supabase = getSupabase();
    if (!supabase) {
        return { success: false, error: 'Supabase no conectado' };
    }
    
    try {
        const { data, error } = await supabase.rpc('register_user', {
            p_email: email,
            p_password: password,
            p_full_name: fullName
        });
        
        if (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message };
        }
        
        return data || { success: false, error: 'Error desconocido' };
    } catch (err) {
        console.error('Excepción en registro:', err);
        return { success: false, error: err.message };
    }
}

async function loginUserLocal(email, password) {
    const supabase = getSupabase();
    if (!supabase) {
        return { success: false, error: 'Supabase no conectado' };
    }
    
    try {
        const { data, error } = await supabase.rpc('login_user', {
            p_email: email,
            p_password: password
        });
        
        if (error) {
            console.error('Error en login:', error);
            return { success: false, error: error.message };
        }
        
        return data || { success: false, error: 'Error desconocido' };
    } catch (err) {
        console.error('Excepción en login:', err);
        return { success: false, error: err.message };
    }
}

function saveSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getSession() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function clearSession() {
    localStorage.removeItem('currentUser');
}

initSupabase();