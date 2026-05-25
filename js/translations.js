const translations = {
    es: {
        // Navegación
        navHome: 'Inicio',
        navTramites: 'Trámites',
        navNoticias: 'Noticias',
        navPerfil: 'Perfil',
        
        // Trámites
        curp: 'CURP',
        rfc: 'RFC',
        acta: 'Acta de Nacimiento',
        servicios: 'Servicios Públicos',
        agua: 'Agua Potable',
        luz: 'Luz / CFE',
        consultar: 'Consultar información',
        
        // Accesibilidad (Página 3 del PDF)
        welcomeTitle: '¿Cómo prefieres ver la información?',
        welcomeSubtitle: 'Puedes cambiar esto en cualquier momento',
        visualMode: 'Contenido visual',
        visualDesc: 'Imágenes e íconos',
        screenReader: 'Lector de pantalla',
        screenReaderDesc: 'Navegación por voz',
        largeText: 'Texto grande',
        largeTextDesc: 'Fuente aumentada',
        languagePref: 'Idioma preferido',
        continue: 'Continuar',
        
        // Instrucciones
        listen: 'Escucha cada paso',
        listenFull: 'Toca ► para escuchar todo el proceso',
        
        // Pasos genéricos
        step1: 'Abre la app y toca el botón',
        step2: 'Escribe tu nombre completo',
        step3: 'Pon tu fecha de nacimiento',
        step4: 'Toca "Buscar" y espera el resultado',
        step5: 'Guarda o imprime tu documento',
        
        // Auth
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        email: 'Correo electrónico',
        password: 'Contraseña',
        name: 'Nombre completo',
        logout: 'Cerrar Sesión',
        
        // Resultados
        curpResult: 'Tu CURP certificada',
        rfcResult: 'Tu RFC',
        actaResult: 'Acta de nacimiento',
        payment: 'Pago en línea',
        search: 'Buscar',
        save: 'Guardar',
        download: 'Descargar PDF',
        
        // Noticias
        news1: 'Nueva plataforma de trámites digitales 2025',
        news2: 'Corte de agua programado en Mérida',
        news3: 'Horario especial CFE para pagos'
    },
    maya: {
        navHome: 'Inicio',
        navTramites: 'Meyajilo\'ob',
        navNoticias: 'Noticias',
        navPerfil: 'Perfil',
        
        curp: 'CURP',
        rfc: 'U xaalil fiscal',
        acta: 'Acta u síijil',
        servicios: 'Meyajilo\'ob tu yo\'ok\'ol kaaj',
        agua: 'Meyajil ja\'',
        luz: 'Meyajil electricidad',
        consultar: 'Píisil le apartado\' le\'',
        
        welcomeTitle: '¿Bix a k\'aat a wilik le información?',
        welcomeSubtitle: 'Je\'el u k\'exel le jump\'éel k\'iin',
        visualMode: 'Contenido visual',
        visualDesc: 'Imágenes e íconos',
        screenReader: 'Lector u pantalla',
        screenReaderDesc: 'Navegación ichil a t\'aan',
        largeText: 'Texto nojoch',
        largeTextDesc: 'Fuente aumentada',
        languagePref: 'Idioma preferido',
        continue: 'Continuar',
        
        listen: 'Túumbenil tuláakal paso',
        listenFull: '▶ Toca para escuchar tuláakal le meyajilo\'',
        
        step1: 'Jóok\'es le app yéetel tóok\' botón',
        step2: 'Ts\'íib a k\'aaba\' tuláakal',
        step3: 'Ts\'íib a k\'iinil síijil',
        step4: 'Tóok\' "Buscar" yéetel áak\' le resultado',
        step5: 'Kanáantik wa imprimir a documento',
        
        login: 'Okol sesión',
        register: 'Registrarte',
        email: 'Correo electrónico',
        password: 'Contraseña',
        name: 'K\'aaba\' tuláakal',
        logout: 'Cerrar sesión',
        
        curpResult: 'A CURP certificada',
        rfcResult: 'A RFC',
        actaResult: 'Acta u síijil',
        payment: 'Pago ichil línea',
        search: 'Kaxik',
        save: 'Kanáantik',
        download: 'Descargar PDF',
        
        news1: 'Túumbenil plataforma digital trámites 2025',
        news2: 'Corte u ja\' Mérida',
        news3: 'Horario especial CFE tia\'al pago'
    }
};

let currentLanguage = 'es';

function t(key) {
    return translations[currentLanguage][key] || translations.es[key] || key;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });
        return true;
    }
    return false;
}

function getCurrentLanguage() {
    return currentLanguage;
}