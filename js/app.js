const App = {
    currentScreen: 'login',
    selectedTramite: null,
    accessibilityMode: null,
    currentLanguage: "es",
    speechRate: 1,
    
    init() {
        checkAuth().then(() => {
            this.currentScreen = 'login';
            this.showLoginScreen();
            this.render();
        });
        
        onAuthChange(() => {
            if (isAuthenticated()) {
                const savedMode = localStorage.getItem('accessibilityMode');
                if (savedMode) {
                    this.accessibilityMode = savedMode;
                    this.applyAccessibilityMode();
                    this.currentScreen = 'tramites';
                    this.showMainApp();
                } else {
                    this.currentScreen = 'config';
                    this.showConfigScreen();
                }
            } else {
                this.currentScreen = 'login';
                this.showLoginScreen();
            }
            this.render();
        });
        
        this.setupNavigation();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
    },
    
    showMainApp() {
        document.getElementById('bottomNav').style.display = 'flex';
    },
    
    showLoginScreen() {
        document.getElementById('bottomNav').style.display = 'none';
    },
    
    showConfigScreen() {
        document.getElementById('bottomNav').style.display = 'none';
    },
    
    updateTime() {
        const now = new Date();
        const timeEl = document.getElementById('currentTime');
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        }
    },
    
    setupNavigation() {
        const bottomNav = document.getElementById('bottomNav');
        if (bottomNav) {
            bottomNav.addEventListener('click', (e) => {
                const btn = e.target.closest('.nav-item');
                if (btn && isAuthenticated()) {
                    const nav = btn.getAttribute('data-nav');
                    if (nav === 'home') this.currentScreen = 'tramites';
                    if (nav === 'tramites') this.currentScreen = 'tramites';
                    if (nav === 'noticias') this.currentScreen = 'noticias';
                    if (nav === 'perfil') this.currentScreen = 'perfil';
                    this.selectedTramite = null;
                    this.render();
                }
            });
        }
    },
    
    applyAccessibilityMode() {
        const body = document.body;
        body.classList.remove('large-text');
        
        if (this.accessibilityMode === 'large-text' && this.currentLanguage !== 'maya') {
            body.classList.add('large-text');
        }
        
        localStorage.setItem('accessibilityMode', this.accessibilityMode || 'visual');
    },
    
    setAccessibilityMode(mode) {
        this.accessibilityMode = mode;
        this.applyAccessibilityMode();
        this.render();
    },

    selectSingleOption(option) {
        if (option === 'maya') {
            this.currentLanguage = 'maya';
            this.accessibilityMode = null;
        } else {
            this.accessibilityMode = option;
            this.currentLanguage = 'es';
        }
        this.render();
    },

    saveConfigAndContinue() {
        if (!this.accessibilityMode && this.currentLanguage !== 'maya') {
            showToastMessage('Por favor selecciona una opción', true);
            return;
        }

        if (this.currentLanguage === 'maya') {
            this.accessibilityMode = 'visual';
        }

        this.applyAccessibilityMode();
        this.currentScreen = 'tramites';
        this.showMainApp();
        this.render();

        if (this.accessibilityMode === 'screenreader') {
            this.speakText('Bienvenido. Toca cualquier botón para escuchar las instrucciones.');
        }
    },
    
    speakText(text) {
        if (this.accessibilityMode !== 'screenreader') {
            return;
        }
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-MX';
            utterance.rate = this.speechRate || 1;
            utterance.pitch = 1;
            const voices = window.speechSynthesis.getVoices();
            const mxVoice = voices.find(voice => voice.lang.includes('es-MX') || voice.name.includes('Mexico'));
            if (mxVoice) utterance.voice = mxVoice;
            window.speechSynthesis.speak(utterance);
        } else {
            console.log("Speech Synthesis no soportado en este navegador");
        }
    },
    
    setSpeechRate(rate) {
        this.speechRate = rate;
        if (this.accessibilityMode === 'screenreader') {
            const speedText = rate === 0.8 ? 'lenta' : rate === 1 ? 'normal' : 'rápida';
            this.speakText('Velocidad de voz cambiada a ' + speedText);
        }
    },
    
    goBack() {
        if (this.currentScreen === 'tramite_detail') {
            this.currentScreen = 'tramites';
        } else if (this.currentScreen === 'tramites') {
            this.currentScreen = 'config';
            this.showConfigScreen();
        } else if (this.currentScreen === 'config') {
            this.currentScreen = 'login';
            this.showLoginScreen();
        } else {
            this.currentScreen = 'tramites';
        }
        this.selectedTramite = null;
        this.render();
        
        if (this.accessibilityMode === 'screenreader') {
            this.speakText('Regresando a la pantalla anterior');
        }
    },
    
    selectTramite(id) {
        this.selectedTramite = id;
        this.currentScreen = 'tramite_detail';
        this.render();
        
        if (this.accessibilityMode === 'screenreader') {
            setTimeout(() => {
                this.speakText('Has seleccionado ' + this.getTramiteTitle(id) + '. Toca el botón de play para escuchar las instrucciones.');
            }, 300);
        }
    },
    
    getTramiteTitle(id) {
        const titles = {
            curp: 'CURP',
            rfc: 'RFC',
            acta: 'Acta de nacimiento',
            agua: 'Agua Potable',
            luz: 'Luz CFE',
            servicios: 'Servicios Públicos'
        };
        return titles[id] || 'Trámite';
    },
    
    getDefaultSteps(tramiteId) {
        if (tramiteId === 'curp') {
            return `
                <div class="step-item"><div class="step-number">1</div><div class="step-content"><strong>Abre la app y toca el botón CURP</strong></div></div>
                <div class="step-item"><div class="step-number">2</div><div class="step-content"><strong>Escribe tu nombre completo</strong></div></div>
                <div class="step-item"><div class="step-number">3</div><div class="step-content"><strong>Pon tu fecha de nacimiento</strong></div></div>
                <div class="step-item"><div class="step-number">4</div><div class="step-content"><strong>Toca 'Buscar' y espera el resultado</strong></div></div>
                <div class="step-item"><div class="step-number">5</div><div class="step-content"><strong>Guarda o imprime tu CURP</strong></div></div>
            `;
        }
        if (tramiteId === 'rfc') {
            return `
                <div class="step-item"><div class="step-number">1</div><div class="step-content"><strong>Abre la app y toca el botón RFC</strong></div></div>
                <div class="step-item"><div class="step-number">2</div><div class="step-content"><strong>Escribe tu nombre completo</strong></div></div>
                <div class="step-item"><div class="step-number">3</div><div class="step-content"><strong>Pon tu fecha de nacimiento</strong></div></div>
                <div class="step-item"><div class="step-number">4</div><div class="step-content"><strong>Ingresa tu CURP</strong></div></div>
                <div class="step-item"><div class="step-number">5</div><div class="step-content"><strong>Toca 'Buscar' y espera el resultado</strong></div></div>
                <div class="step-item"><div class="step-number">6</div><div class="step-content"><strong>Guarda o imprime tu RFC</strong></div></div>
            `;
        }
        if (tramiteId === 'acta') {
            return `
                <div class="step-item"><div class="step-number">1</div><div class="step-content"><strong>Ingresa al portal de actas de nacimiento.</strong></div></div>
                <div class="step-item"><div class="step-number">2</div><div class="step-content"><strong>Captura tu CURP o datos personales.</strong></div></div>
                <div class="step-item"><div class="step-number">3</div><div class="step-content"><strong>Verifica que tu información sea correcta.</strong></div></div>
                <div class="step-item"><div class="step-number">4</div><div class="step-content"><strong>Visualiza la vista previa del acta.</strong></div></div>
                <div class="step-item"><div class="step-number">5</div><div class="step-content"><strong>Realiza el pago correspondiente.</strong></div></div>
                <div class="step-item"><div class="step-number">6</div><div class="step-content"><strong>Descarga el acta actualizada en PDF.</strong></div></div>
                <div class="step-item"><div class="step-number">7</div><div class="step-content"><strong>Guarda o imprime tu documento.</strong></div></div>
            `;
        }
        if (tramiteId === 'servicios') {
            return `
                <div class="step-item"><div class="step-number">1</div><div class="step-content"><strong>Ingresa al portal de CAPA.</strong></div></div>
                <div class="step-item"><div class="step-number">2</div><div class="step-content"><strong>Captura tu número de contrato.</strong></div></div>
                <div class="step-item"><div class="step-number">3</div><div class="step-content"><strong>Consulta tu saldo pendiente.</strong></div></div>
                <div class="step-item"><div class="step-number">4</div><div class="step-content"><strong>Verifica el monto a pagar.</strong></div></div>
                <div class="step-item"><div class="step-number">5</div><div class="step-content"><strong>Realiza el pago en línea.</strong></div></div>
                <div class="step-item"><div class="step-number">6</div><div class="step-content"><strong>Descarga tu comprobante.</strong></div></div>
            `;
        }
        return `<p>Instrucciones en desarrollo...</p>`;
    },

    getVideoUrl(tramiteId) {
        const videos = {
            curp: 'https://www.youtube.com/embed/a5UqBzJPE5w',
            rfc: 'https://www.youtube.com/embed/ZkzsDKseYvU',
            acta: 'https://www.youtube.com/embed/a5UqBzJPE5w',
            agua: 'https://www.youtube.com/embed/dkpqVCMyrXc',
            luz: 'https://www.youtube.com/embed/j8-uu2kN6qU',
            servicios: 'https://www.youtube.com/embed/j8-uu2kN6qU'
        };
        return videos[tramiteId] || videos.curp;
    },

    getMayaContent() {
        return {
            main: {
                title: "LENGUAJE MAYA",
                subtitle: "K'i'mak óolal",
                description: "Ti' le apartado'o' le', k'a'abet a beetik a peticiones ichil maayat'aan",
                curp: "CURP",
                curpDesc: "Píisil le apartado' le'",
                rfc: "RFC",
                rfcDesc: "Píisil le apartado' le'",
                acta: "Acta u síijil",
                actaDesc: "Píisil le apartado' le'",
                servicios: "Servicios",
                serviciosDesc: "Píisil le apartado' le'",
                footer1: "U yéetel a t'aan",
                footer2: "Áantaj",
                footer3: "U meyajilil ajustes"
            }
        };
    },

    getFullInstructionsMaya(tramiteId) {
        if (tramiteId === 'curp') {
            return `
                <div class="instructions-complete">
                    <div class="instruction-method">
                        <h4>1. Yéetel a CURP (wa a k'ajóoltik)</h4>
                        <p><strong>K'a'abet a k'áat a INE Identificación oficial</strong></p>
                        <div class="steps-list">
                            <p><strong>Meyajilo'ob:</strong></p>
                            <ol>
                                <li>Okol ti' le portal oficial CURP.</li>
                                <li>Táak le opción "Clave Única de Registro de Población".</li>
                                <li>Ts'íib a CURP tuláakal.</li>
                                <li>Ts'íib le código verificación (captcha).</li>
                                <li>Píisil "Buscar".</li>
                                <li>Le sistema ku ye'esik a CURP certificada.</li>
                                <li>Je'el a wáantik ichil PDF wa a imprimir.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="instruction-method">
                        <h4>2. Yéetel a datos personales (wa ma' a k'ajóoltik a CURP)</h4>
                        <div class="steps-list">
                            <p><strong>Meyajilo'ob:</strong></p>
                            <ol>
                                <li>Okol ti' le portal oficial.</li>
                                <li>Táak le opción "Datos Personales".</li>
                                <li>Ts'íib le datosob:</li>
                                <ul><li>K'aaba'</li><li>U paalil k'aaba'</li><li>U na'al k'aaba'</li><li>U k'iinil síjil</li><li>Sexo</li><li>Estado tu síjil</li></ul>
                                <li>Ts'íib le código verificación (captcha).</li>
                                <li>Píisil "Buscar".</li>
                                <li>Le sistema ku kaxik a CURP automáticamente.</li>
                                <li>Je'el a wáantik wa a imprimir gratis.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            `;
        }
        if (tramiteId === 'rfc') {
            return `
                <div class="instructions-complete">
                    <div class="instruction-method">
                        <h4>RFC — U xaalil fiscal</h4>
                        <p><strong>VIDEO TUTORIAL TE'ELA'</strong></p>
                        <p><strong>U meyajilil u k'áat RFC túumbenil</strong></p>
                        <p><strong>U k'áat cita ti' RFC</strong></p>
                    </div>
                    <div class="instruction-method">
                        <h4>K'a'abeto'ob:</h4>
                        <ul><li>CURP</li><li>RFC</li><li>INE wa identificación oficial</li><li>Comprobante de domicilio (wa junp'éel k'ino'ob)</li></ul>
                    </div>
                    <div class="instruction-method">
                        <h4>Opciones de trámite:</h4>
                        <ul><li>Contribuyente que cuente con RFC</li><li>Inscripción al padrón de contribuyentes Personas Morales</li><li>Inscripción al padrón de contribuyentes Personas Físicas</li></ul>
                    </div>
                    <div class="instruction-method">
                        <h4>Meyajilo'ob:</h4>
                        <div class="steps-list"><ol><li>Okol ti' le portal citas SAT.</li><li>Táak "Registrar cita".</li><li>Táak le trámite ka k'áat.</li><li>Táak a estado yéetel oficina SAT.</li><li>Táak k'iin yéetel horario disponible.</li><li>Ts'íib a datos personales.</li><li>Confirma la cita.</li><li>Guarda el comprobante wa le folio u cita.</li></ol></div>
                    </div>
                    <div class="instruction-method"><h4>Recuerda:</h4><p>Las citas son irreversibles. Asegúrate de llevar todos los documentos requeridos.</p></div>
                </div>
            `;
        }
        if (tramiteId === 'acta') {
            return `
                <div class="instructions-complete">
                    <div class="instruction-method"><h4>ACTA U SÍIJIL</h4><p><strong>VIDEO TUTORIAL TE'ELA'</strong></p><p><strong>U meyajilil u k'áat acta u síjil túumbenil</strong></p></div>
                    <div class="instruction-method"><h4>K'a'abeto'ob:</h4><ul><li>CURP</li><li>K'aaba' tuláakal</li><li>U k'iinil síjil</li><li>Método de pago (wa k'a'abet)</li></ul></div>
                    <div class="instruction-method"><h4>Meyajilo'ob:</h4><div class="steps-list"><ol><li>Okol ti' le portal actas u síjil.</li><li>Ts'íib a CURP wa a datos personales.</li><li>Xook wa ma'alob a información.</li><li>Iláa le vista previa u acta.</li><li>Beet le pago correspondiente.</li><li>Je'el a wáantik le acta túumbenil ichil PDF.</li><li>Guarda wa imprimir a documento.</li></ol></div></div>
                </div>
            `;
        }
        if (tramiteId === 'servicios') {
            return `
                <div class="instructions-complete">
                    <div class="instruction-method"><h4>Meyajilo'ob tu yo'ok'ol kaaj</h4><p><strong>VIDEO TUTORIAL TE'ELA'</strong></p></div>
                    <div class="instruction-method"><h4>💧 Meyajil ja' (CAPA)</h4><p><strong>K'a'abeto'ob:</strong></p><ul><li>Número de contrato</li><li>Dirección u meyajil</li><li>Método de pago</li></ul><div class="steps-list"><p><strong>Meyajilo'ob:</strong></p><ol><li>Okol ti' le portal CAPA.</li><li>Ts'íib a número contrato.</li><li>Iláa a saldo pendiente.</li><li>Xook le monto ku k'a'abet pago.</li><li>Beet le pago ichil línea.</li><li>Je'el a wáantik a comprobante.</li></ol></div><p><strong>Okol ti' le sitio oficial CAPA</strong></p></div>
                    <div class="instruction-method"><h4>⚡ Meyajil electricidad (CFE)</h4><p><strong>K'a'abeto'ob:</strong></p><ul><li>Número de servicio</li><li>Dirección u naajil</li><li>Método de pago</li></ul><div class="steps-list"><p><strong>Meyajilo'ob:</strong></p><ol><li>Okol ti' le portal CFE.</li><li>Ts'íib a número servicio.</li><li>Iláa a recibo wa adeudo.</li><li>Xook le monto ku k'a'abet pago.</li><li>Beet le pago ichil línea.</li><li>Guarda a comprobante.</li></ol></div><p><strong>Okol ti' le sitio oficial CFE</strong></p></div>
                </div>
            `;
        }
        return '';
    },

    renderMayaInstructions(tramiteId) {
        const title = this.getTramiteTitle(tramiteId);
        const videoUrl = this.getVideoUrl(tramiteId);
        
        let officialText = 'Bin ti\' le sitio oficial ';
        if (tramiteId === 'curp') officialText += 'CURP →';
        else if (tramiteId === 'rfc') officialText += 'SAT →';
        else if (tramiteId === 'acta') officialText += 'Acta u síijil →';
        else officialText += 'Servicios →';
        
        return `
            <div class="instructions-screen">
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>${title}</h2>
                            <p>VIDEO TUTORIAL TE'ELA'</p>
                        </div>
                    </div>
                </div>
                <div class="video-tutorial">
                    <h4>📺 VIDEO TUTORIAL TE'ELA'</h4>
                    <iframe src="${videoUrl}" title="Video Tutorial ${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div style="margin-top: 8px; text-align: right;"><a href="${videoUrl.replace('/embed/', '/watch?v=')}" target="_blank" style="color: #1e3a8a; font-size: 12px;">Mirar en YouTube →</a></div>
                </div>
                ${this.getFullInstructionsMaya(tramiteId)}
                <div class="oficial-link">
                    <a href="#" onclick="window.app.openOfficialSite('${tramiteId}')" class="btn-oficial">${officialText}</a>
                </div>
            </div>
        `;
    },

    renderMayaHome() {
        const maya = this.getMayaContent();
        return `
            <div class="maya-screen">
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>${maya.main.title}</h2>
                            <p>${maya.main.subtitle}</p>
                        </div>
                    </div>
                </div>
                <div class="maya-description"><p>${maya.main.description}</p></div>
                <div class="main-buttons">
                    <div class="tramite-card" onclick="window.app.selectTramite('curp')"><div class="icon">📄</div><h3>${maya.main.curp}</h3><p>${maya.main.curpDesc}</p></div>
                    <div class="tramite-card" onclick="window.app.selectTramite('rfc')"><div class="icon">🏢</div><h3>${maya.main.rfc}</h3><p>${maya.main.rfcDesc}</p></div>
                    <div class="tramite-card" onclick="window.app.selectTramite('acta')"><div class="icon">📜</div><h3>${maya.main.acta}</h3><p>${maya.main.actaDesc}</p></div>
                    <div class="tramite-card" onclick="window.app.selectTramite('servicios')"><div class="icon">💧⚡</div><h3>${maya.main.servicios}</h3><p>${maya.main.serviciosDesc}</p></div>
                </div>
                <div class="maya-footer"><div class="maya-help"><div class="help-item" onclick="window.app.showHelp()"><span class="help-icon">🆘</span><span>${maya.main.footer1}</span></div><div class="help-item" onclick="window.app.goToConfig()"><span class="help-icon">⚙️</span><span>${maya.main.footer2}</span></div><div class="help-item" onclick="window.app.showSettings()"><span class="help-icon">🔧</span><span>${maya.main.footer3}</span></div></div></div>
            </div>
        `;
    },

    showHelp() {
        if (this.accessibilityMode === 'screenreader') {
            this.speakText('Ayuda: Puedes consultar cualquier trámite tocando los botones');
        }
        showToastMessage('Selecciona un trámite para comenzar');
    },

    goToConfig() {
        this.currentScreen = 'config';
        this.render();
        if (this.accessibilityMode === 'screenreader') {
            this.speakText('Regresando a configuración');
        }
    },

    showSettings() {
        this.currentScreen = 'perfil';
        this.render();
        if (this.accessibilityMode === 'screenreader') {
            this.speakText('Abriendo ajustes');
        }
    },

    speakInstructions(tramiteId) {
        if (this.accessibilityMode !== 'screenreader') return;
        let text = `Instrucciones para ${this.getTramiteTitle(tramiteId)}. `;
        if (tramiteId === 'curp') {
            text += "Paso 1: Abre la app y toca el botón CURP. Paso 2: Escribe tu nombre completo. Paso 3: Pon tu fecha de nacimiento. Paso 4: Toca Buscar y espera el resultado. Paso 5: Guarda o imprime tu CURP.";
        } else if (tramiteId === 'rfc') {
            text += "Paso 1: Abre la app y toca el botón RFC. Paso 2: Escribe tu nombre completo. Paso 3: Pon tu fecha de nacimiento. Paso 4: Ingresa tu CURP. Paso 5: Toca Buscar. Paso 6: Guarda o imprime tu RFC.";
        } else if (tramiteId === 'acta') {
            text += "Paso 1: Abre la app y toca el botón Acta. Paso 2: Selecciona tu estado de nacimiento. Paso 3: Escribe tu nombre completo. Paso 4: Ingresa tu fecha de nacimiento. Paso 5: Toca Buscar. Paso 6: Descarga o imprime tu acta.";
        } else if (tramiteId === 'servicios') {
            text += "Para Agua: Ingresa tu número de cuenta. Para Luz: Ingresa tu número de servicio. Consulta tu adeudo, paga en línea y guarda el comprobante.";
        }
        this.speakText(text);
    },

    async handleLogin() {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        if (!email || !password) {
            showToastMessage('Completa todos los campos', true);
            return;
        }
        const success = await login(email, password);
        if (success) {
            this.currentScreen = 'config';
            this.render();
        }
    },
    
    async handleRegister() {
        const name = document.getElementById('regName')?.value;
        const email = document.getElementById('regEmail')?.value;
        const password = document.getElementById('regPassword')?.value;
        if (!name || !email || !password) {
            showToastMessage('Completa todos los campos', true);
            return;
        }
        const success = await register(email, password, name);
        if (success) {
            this.showLoginScreenInApp();
        }
    },
    
    showRegisterScreen() {
        this.currentScreen = 'register';
        this.render();
    },
    
    showLoginScreenInApp() {
        this.currentScreen = 'login';
        this.render();
    },
    
    async logout() {
        await logout();
        localStorage.removeItem('accessibilityMode');
        this.accessibilityMode = null;
        this.currentScreen = 'login';
        this.showLoginScreen();
        this.render();
    },
    
    render() {
        const container = document.getElementById('mainContent');
        if (!isAuthenticated()) {
            if (this.currentScreen === 'login') {
                container.innerHTML = this.renderLogin();
            } else if (this.currentScreen === 'register') {
                container.innerHTML = this.renderRegister();
            } else {
                container.innerHTML = this.renderLogin();
            }
            return;
        }
        if (this.currentScreen === 'config') {
            container.innerHTML = this.renderConfigScreen();
            return;
        }
        if (this.currentLanguage === 'maya') {
            if (this.currentScreen === 'tramites') {
                container.innerHTML = this.renderMayaHome();
            } else if (this.currentScreen === 'tramite_detail') {
                container.innerHTML = this.renderMayaInstructions(this.selectedTramite);
            }
            return;
        }
        switch(this.currentScreen) {
            case 'tramites':
                container.innerHTML = this.renderTramitesList();
                break;
            case 'tramite_detail':
                container.innerHTML = this.renderTramiteDetail();
                break;
            case 'noticias':
                container.innerHTML = this.renderNoticias();
                break;
            case 'perfil':
                container.innerHTML = this.renderPerfil();
                break;
            default:
                container.innerHTML = this.renderTramitesList();
        }
        if (isAuthenticated() && this.currentScreen !== 'config') {
            document.querySelectorAll('.nav-item').forEach(btn => {
                const nav = btn.getAttribute('data-nav');
                btn.classList.remove('active');
                if ((nav === 'home' && this.currentScreen === 'tramites') ||
                    (nav === 'tramites' && ['tramites', 'tramite_detail'].includes(this.currentScreen)) ||
                    (nav === 'noticias' && this.currentScreen === 'noticias') ||
                    (nav === 'perfil' && this.currentScreen === 'perfil')) {
                    btn.classList.add('active');
                }
            });
        }
    },
    
    renderLogin() {
        return '<div class="login-screen"><div class="welcome-header"><div class="icon">📁</div><h1>Hey, Bienvenido De Nuevo</h1><p>Por favor, inicie sesión en tu cuenta.</p></div><div class="login-form"><div class="input-group"><label>📧 Correo electrónico</label><input type="email" id="loginEmail" placeholder="admin@ejemplo.com"></div><div class="input-group"><label>🔒 Contraseña</label><input type="password" id="loginPassword" placeholder="••••••••"></div><div class="forgot-password"><a href="#">❓ ¿Olvidaste la contraseña?</a></div><button class="btn-login" onclick="window.app.handleLogin()">▶️ INICIAR SESIÓN</button><div class="register-link">¿No tienes una cuenta? <a href="#" onclick="window.app.showRegisterScreen(); return false;">📝 Regístrate</a></div></div></div>';
    },
    
    renderRegister() {
        return '<div class="login-screen"><div class="welcome-header"><div class="icon">📝</div><h1>Regístrate</h1><p>Crea tu cuenta para comenzar.</p></div><div class="login-form"><div class="input-group"><label>👤 Nombre completo</label><input type="text" id="regName" placeholder="Tu nombre completo"></div><div class="input-group"><label>📧 Correo electrónico</label><input type="email" id="regEmail" placeholder="correo@ejemplo.com"></div><div class="input-group"><label>🔒 Contraseña</label><input type="password" id="regPassword" placeholder="Mínimo 6 caracteres"></div><button class="btn-login" onclick="window.app.handleRegister()">✓ REGISTRARSE</button><div class="register-link">¿Ya tienes una cuenta? <a href="#" onclick="window.app.showLoginScreenInApp(); return false;">▶️ Iniciar Sesión</a></div></div></div>';
    },

    renderConfigScreen() {
        return `
            <div class="config-screen">
                <div class="config-header-bar"></div>
                <div class="config-title">
                    <h2>¿Cómo prefieres ver la información?</h2>
                    <p>Puedes cambiar esto en cualquier momento</p>
                </div>
                <div class="config-grid">
                    <div class="config-card ${this.accessibilityMode === 'screenreader' ? 'selected' : ''}" onclick="window.app.selectSingleOption('screenreader')">
                        <div class="config-card-icon">🎧</div>
                        <h3>Lector de pantalla</h3>
                        <p>Navegación por voz</p>
                    </div>
                    <div class="config-card ${this.accessibilityMode === 'visual' ? 'selected' : ''}" onclick="window.app.selectSingleOption('visual')">
                        <div class="config-card-icon">🖼️</div>
                        <h3>Contenido visual</h3>
                        <p>Imágenes e íconos</p>
                    </div>
                    <div class="config-card ${this.accessibilityMode === 'large-text' ? 'selected' : ''}" onclick="window.app.selectSingleOption('large-text')">
                        <div class="config-card-icon">🔤</div>
                        <h3>Texto grande</h3>
                        <p>Fuente aumentada</p>
                    </div>
                    <div class="config-card ${this.currentLanguage === 'maya' ? 'selected' : ''}" onclick="window.app.selectSingleOption('maya')">
                        <div class="config-card-icon">🌍</div>
                        <h3>Maya / Español</h3>
                        <p>Idioma preferido</p>
                    </div>
                </div>
                <button class="btn-continue" onclick="window.app.saveConfigAndContinue()">Continuar →</button>
            </div>
        `;
    },

    // ==================== RENDER TRAMITES LIST ====================
    renderTramitesList() {
        // Modo texto grande
        if (this.accessibilityMode === 'large-text') {
            if (this.currentLanguage === 'maya') {
                return this.renderMayaHome();
            }
            return `
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>🔤 Trámites México</h2>
                            <p>Selecciona el trámite que necesitas</p>
                        </div>
                    </div>
                </div>
                <div class="main-buttons">
                    <div class="tramite-card" onclick="window.app.selectTramite('curp')">
                        <div class="icon">🪪</div>
                        <h3>CURP</h3>
                        <p>Consultar información</p>
                    </div>
                    <div class="tramite-card" onclick="window.app.selectTramite('rfc')">
                        <div class="icon">🏢</div>
                        <h3>RFC</h3>
                        <p>Consultar información</p>
                    </div>
                    <div class="tramite-card" onclick="window.app.selectTramite('acta')">
                        <div class="icon">📜</div>
                        <h3>Acta de Nacimiento</h3>
                        <p>Consultar información</p>
                    </div>
                    <div class="tramite-card" onclick="window.app.selectTramite('servicios')">
                        <div class="icon">💧⚡</div>
                        <h3>Servicios Públicos</h3>
                        <p>Consultar información</p>
                    </div>
                </div>
            `;
        }
        
        // Modo lector de pantalla - ORIGINAL RESTAURADO
        if (this.accessibilityMode === 'screenreader') {
            if (this.currentLanguage === 'maya') {
                return this.renderMayaHome();
            }
            return `
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>Lector de Pantalla</h2>
                            <p>Navega con tu voz</p>
                        </div>
                    </div>
                </div>
                <div class="volume-tip">🔊 Subir el volumen del dispositivo para escuchar las instrucciones</div>
                <div class="main-buttons">
                    <div class="tramite-card" onclick="window.app.selectTramite('curp')" onmouseenter="window.app.speakText('CURP, toca para consultar tu Clave Única de Registro de Población')">
                        <div class="icon">👤</div>
                        <h3>CURP</h3>
                        <p>Toca para escuchar</p>
                    </div>
                    <div class="tramite-card" onclick="window.app.selectTramite('rfc')" onmouseenter="window.app.speakText('RFC, toca para consultar tu Registro Federal de Contribuyentes')">
                        <div class="icon">📄</div>
                        <h3>RFC</h3>
                        <p>Toca para escuchar</p>
                    </div>
                    <div class="tramite-card" onclick="window.app.selectTramite('acta')" onmouseenter="window.app.speakText('Acta de Nacimiento, toca para consultar tu acta de nacimiento')">
                        <div class="icon">📋</div>
                        <h3>Acta</h3>
                        <p>Toca para escuchar</p>
                    </div>
                    <div class="tramite-card" onclick="window.app.selectTramite('servicios')" onmouseenter="window.app.speakText('Servicios Públicos, toca para consultar agua y luz')">
                        <div class="icon">🏛️</div>
                        <h3>Servicios</h3>
                        <p>Toca para escuchar</p>
                    </div>
                </div>
                <div class="speed-control">
                    <strong>⚡ Velocidad de voz:</strong>
                    <div class="speed-buttons">
                        <button onclick="window.app.setSpeechRate(0.8)" class="${this.speechRate === 0.8 ? 'active' : ''}">🐢 Lento</button>
                        <button onclick="window.app.setSpeechRate(1)" class="${this.speechRate === 1 ? 'active' : ''}">Normal</button>
                        <button onclick="window.app.setSpeechRate(1.2)" class="${this.speechRate === 1.2 ? 'active' : ''}">🐇 Rápido</button>
                    </div>
                </div>
                <div style="text-align:center; margin-top:20px; font-size:13px; color:#64748b;">💡 Consejo: Mantén presionado cualquier botón para escuchar su descripción.</div>
            `;
        }
        
        // Modo contenido visual
        if (this.accessibilityMode === 'visual' || !this.accessibilityMode) {
            return `
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>📹 Video Tutoriales</h2>
                            <p>Aprende paso a paso cómo realizar tus trámites</p>
                        </div>
                    </div>
                </div>
                <div class="video-tutorials-container">
                    <div class="video-card" onclick="window.app.selectTramite('curp')">
                        <div class="video-thumbnail"><img src="https://img.youtube.com/vi/a5UqBzJPE5w/maxresdefault.jpg" alt="CURP"><div class="play-overlay">▶</div></div>
                        <div class="video-info"><h3>Cómo obtener tu CURP</h3><span class="video-tag">CURP</span><span class="video-duration">04:30</span></div>
                    </div>
                    <div class="video-card" onclick="window.app.selectTramite('rfc')">
                        <div class="video-thumbnail"><img src="https://img.youtube.com/vi/ZkzsDKseYvU/maxresdefault.jpg" alt="RFC"><div class="play-overlay">▶</div></div>
                        <div class="video-info"><h3>Cómo tramitar tu RFC</h3><span class="video-tag">RFC / SAT</span><span class="video-duration">06:12</span></div>
                    </div>
                    <div class="video-card" onclick="window.app.selectTramite('acta')">
                        <div class="video-thumbnail"><img src="https://img.youtube.com/vi/a5UqBzJPE5w/maxresdefault.jpg" alt="Acta"><div class="play-overlay">▶</div></div>
                        <div class="video-info"><h3>Acta de Nacimiento en línea</h3><span class="video-tag">ACTA</span><span class="video-duration">05:45</span></div>
                    </div>
                    <div class="video-card" onclick="window.app.selectTramite('servicios')">
                        <div class="video-thumbnail"><img src="https://img.youtube.com/vi/j8-uu2kN6qU/maxresdefault.jpg" alt="Servicios"><div class="play-overlay">▶</div></div>
                        <div class="video-info"><h3>Pago de Agua y Luz CFE</h3><span class="video-tag">SERVICIOS</span><span class="video-duration">07:20</span></div>
                    </div>
                </div>
            `;
        }
        
        if (this.currentLanguage === 'maya') {
            return this.renderMayaHome();
        }
        
        return `
            <div class="main-buttons">
                <div class="tramite-card" onclick="window.app.selectTramite('curp')"><div class="icon">🪪</div><h3>CURP</h3><p>Consultar información</p></div>
                <div class="tramite-card" onclick="window.app.selectTramite('rfc')"><div class="icon">🏢</div><h3>RFC</h3><p>Consultar información</p></div>
                <div class="tramite-card" onclick="window.app.selectTramite('acta')"><div class="icon">📜</div><h3>Acta de Nacimiento</h3><p>Consultar información</p></div>
                <div class="tramite-card" onclick="window.app.selectTramite('servicios')"><div class="icon">💧⚡</div><h3>Servicios Públicos</h3><p>Consultar información</p></div>
            </div>
        `;
    },
    
    // ==================== RENDER TRAMITE DETAIL - MODO TEXTO GRANDE (basado en capturas) ====================
    renderTramiteDetail() {
        if (!this.selectedTramite) {
            this.goBack();
            return;
        }

        const title = this.getTramiteTitle(this.selectedTramite);
        const videoUrl = this.getVideoUrl(this.selectedTramite);

        // MODO LECTOR DE PANTALLA - ORIGINAL RESTAURADO
        if (this.accessibilityMode === 'screenreader') {
            const stepsHTML = this.getDefaultSteps(this.selectedTramite);
            return `
                <div class="instructions-screen">
                    <div class="header-blue">
                        <div class="header-with-back">
                            <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                            <div class="header-text">
                                <h2>${title}</h2>
                                <p>Escucha las instrucciones</p>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin: 30px 0 20px 0;">
                        <button onclick="window.app.speakInstructions('${this.selectedTramite}')" class="big-play-button">▶</button>
                        <p style="margin-top: 12px; font-weight: 600; color: #1e3a8a;">Toca ▶ para escuchar todo el proceso</p>
                    </div>
                    <div class="steps-container">${stepsHTML}</div>
                    <div class="oficial-link" style="text-align: center; margin: 20px 0;">
                        <a href="#" onclick="window.app.openOfficialSite('${this.selectedTramite}')" class="btn-oficial">🌐 Ir al sitio oficial →</a>
                    </div>
                </div>
            `;
        }
        
        // MODO TEXTO GRANDE - INTERFAZ CURP (como en captura 1)
        if (this.accessibilityMode === 'large-text' && this.selectedTramite === 'curp') {
            return `
                <div class="instructions-screen">
                    <div class="header-blue">
                        <div class="header-with-back">
                            <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                            <div class="header-text">
                                <h2>INTERFAZ DE CURP</h2>
                                <p>CURP - Clave Única de Registro de Población</p>
                            </div>
                        </div>
                    </div>
                    <div class="video-tutorial">
                        <h4>📺 VIDEO TUTORIAL AQUÍ</h4>
                        <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="section-title">Proceso para obtener la CURP</div>
                    <div class="method-card">
                        <h3>1. Con tu CURP (si ya la conoces)</h3>
                        <p><strong>Necesitarás:</strong> tu INE o Identificación oficial</p>
                        <div class="steps-list">
                            <p><strong>Pasos:</strong></p>
                            <ol>
                                <li>Entra al portal oficial de CURP.</li>
                                <li>Selecciona la opción "Clave Única de Registro de Población".</li>
                                <li>Escribe tu CURP completa.</li>
                                <li>Captura el código de verificación (captcha).</li>
                                <li>Haz clic en "Buscar".</li>
                                <li>El sistema mostrará tu CURP certificado.</li>
                                <li>Puedes descargarla en PDF o imprimirla.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('curp')" class="btn-oficial">🌐 Ir al sitio oficial de CURP →</a>
                    </div>
                    <div class="method-card">
                        <h3>2. Con tus datos personales (si no recuerdas tu CURP)</h3>
                        <div class="steps-list">
                            <p><strong>Pasos:</strong></p>
                            <ol>
                                <li>Entra al portal oficial.</li>
                                <li>Selecciona la opción "Datos Personales".</li>
                                <li>Llena los siguientes datos:
                                    <ul><li>Nombre(s)</li><li>Apellido paterno</li><li>Apellido materno</li><li>Fecha de nacimiento</li><li>Sexo</li><li>Estado de nacimiento</li></ul>
                                </li>
                                <li>Escribe el código de verificación (captcha).</li>
                                <li>Presiona "Buscar".</li>
                                <li>El sistema localizará tu CURP automáticamente.</li>
                                <li>Descárgala o imprímela gratis.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('curp')" class="btn-oficial">🌐 Ir al sitio oficial de CURP →</a>
                    </div>
                </div>
            `;
        }
        
        // MODO TEXTO GRANDE - INTERFAZ RFC (como en captura 2)
        if (this.accessibilityMode === 'large-text' && this.selectedTramite === 'rfc') {
            return `
                <div class="instructions-screen">
                    <div class="header-blue">
                        <div class="header-with-back">
                            <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                            <div class="header-text">
                                <h2>INTERFAZ DE RFC</h2>
                                <p>RFC - Situación Fiscal</p>
                            </div>
                        </div>
                    </div>
                    <div class="video-tutorial">
                        <h4>📺 VIDEO TUTORIAL AQUÍ</h4>
                        <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="section-title">Proceso para Actualizar RFC</div>
                    <div class="method-card">
                        <h3>Sacar Cita Para RFC</h3>
                        <div class="requirements-box">
                            <p><strong>Requisitos:</strong></p>
                            <ul><li>CURP</li><li>RFC</li><li>INE o identificación oficial</li><li>Comprobante de domicilio (en algunos casos)</li></ul>
                        </div>
                        <div class="steps-list">
                            <p><strong>Pasos:</strong></p>
                            <ol>
                                <li>Entra al portal oficial del SAT.</li>
                                <li>Inicia sesión con tu RFC y contraseña.</li>
                                <li>Ve a "Actualización al RFC".</li>
                                <li>Selecciona el dato que deseas modificar.</li>
                                <li>Captura la nueva información.</li>
                                <li>Verifica que los datos sean correctos.</li>
                                <li>Envía la solicitud.</li>
                                <li>Descarga o guarda el acuse de actualización.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('rfc')" class="btn-oficial">🌐 Ir al sitio oficial del SAT Citas →</a>
                    </div>
                    <div class="method-card">
                        <h3>Sacar Cita Para RFC</h3>
                        <div class="requirements-box">
                            <p><strong>Requisitos:</strong></p>
                            <ul><li>CURP</li><li>RFC</li><li>INE o identificación oficial</li><li>Comprobante de domicilio (en algunos casos)</li></ul>
                        </div>
                        <div class="steps-list">
                            <p><strong>Pasos:</strong></p>
                            <ol>
                                <li>Ingresa al portal de citas del SAT.</li>
                                <li>Selecciona "Registrar cita".</li>
                                <li>Elige el trámite que necesitas.</li>
                                <li>Selecciona tu estado y oficina SAT.</li>
                                <li>Escoge fecha y horario disponible.</li>
                                <li>Captura tus datos personales.</li>
                                <li>Confirma la cita.</li>
                                <li>Guarda el comprobante o folio de cita.</li>
                            </ol>
                        </div>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('rfc')" class="btn-oficial">🌐 Ir al sitio oficial del SAT →</a>
                    </div>
                </div>
            `;
        }
        
        // MODO TEXTO GRANDE - INTERFAZ ACTA (como en captura 3)
        if (this.accessibilityMode === 'large-text' && this.selectedTramite === 'acta') {
            return `
                <div class="instructions-screen">
                    <div class="header-blue">
                        <div class="header-with-back">
                            <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                            <div class="header-text">
                                <h2>INTERFAZ DE ACTA DE NACIMIENTO</h2>
                                <p>ACTA - Acta de nacimiento</p>
                            </div>
                        </div>
                    </div>
                    <div class="video-tutorial">
                        <h4>📺 VIDEO TUTORIAL AQUÍ</h4>
                        <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="section-title">Proceso para obtener acta de nacimiento actualizada</div>
                    <div class="requirements-box">
                        <p><strong>Requisitos:</strong></p>
                        <ul><li>CURP</li><li>Nombre completo</li><li>Fecha de nacimiento</li><li>Método de pago (si aplica)</li></ul>
                    </div>
                    <div class="steps-list">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Ingresa al portal de actas de nacimiento.</li>
                            <li>Captura tu CURP o datos personales.</li>
                            <li>Verifica que tu información sea correcta.</li>
                            <li>Visualiza la vista previa del acta.</li>
                            <li>Realiza el pago correspondiente.</li>
                            <li>Descarga el acta actualizada en PDF.</li>
                            <li>Guarda o imprime tu documento.</li>
                        </ol>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('acta')" class="btn-oficial">🌐 Ir al sitio oficial del Acta de nacimiento →</a>
                    </div>
                </div>
            `;
        }
        
        // MODO TEXTO GRANDE - INTERFAZ SERVICIOS (como en captura 4)
        if (this.accessibilityMode === 'large-text' && this.selectedTramite === 'servicios') {
            return `
                <div class="instructions-screen">
                    <div class="header-blue">
                        <div class="header-with-back">
                            <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                            <div class="header-text">
                                <h2>INTERFAZ DE SERVICIOS PUBLICOS</h2>
                                <p>Servicios Públicos - Servicios Disponibles</p>
                            </div>
                        </div>
                    </div>
                    <div class="section-title">Servicio de Agua</div>
                    <div class="video-tutorial">
                        <h4>📺 Video Tutorial</h4>
                        <iframe src="${this.getVideoUrl('agua')}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="requirements-box">
                        <p><strong>Requisitos:</strong></p>
                        <ul><li>Número de contrato</li><li>Dirección del servicio</li><li>Método de pago</li></ul>
                    </div>
                    <div class="steps-list">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Ingresa al portal de CAPA.</li>
                            <li>Captura tu número de contrato.</li>
                            <li>Consulta tu saldo pendiente.</li>
                            <li>Verifica el monto a pagar.</li>
                            <li>Realiza el pago en línea.</li>
                            <li>Descarga tu comprobante.</li>
                        </ol>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('servicios')" class="btn-oficial">🌐 Ir al sitio oficial de CAPA →</a>
                    </div>
                    <div class="section-title">Servicio de Electricidad</div>
                    <div class="video-tutorial">
                        <h4>📺 Video Tutorial</h4>
                        <iframe src="${this.getVideoUrl('luz')}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="requirements-box">
                        <p><strong>Requisitos:</strong></p>
                        <ul><li>Número de servicio</li><li>Dirección del domicilio</li><li>Método de pago</li></ul>
                    </div>
                    <div class="steps-list">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Ingresa al portal de CFE.</li>
                            <li>Captura tu número de servicio.</li>
                            <li>Consulta tu recibo o adeudo.</li>
                            <li>Verifica el monto a pagar.</li>
                            <li>Realiza el pago en línea.</li>
                            <li>Guarda tu comprobante.</li>
                        </ol>
                    </div>
                    <div class="oficial-link">
                        <a href="#" onclick="window.app.openOfficialSite('servicios')" class="btn-oficial">🌐 Ir al sitio oficial →</a>
                    </div>
                </div>
            `;
        }

        // MODO NORMAL (por defecto)
        return `
            <div class="instructions-screen">
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>${title}</h2>
                            <p>Información y tutorial</p>
                        </div>
                    </div>
                </div>
                <div class="video-tutorial">
                    <h4>📺 VIDEO TUTORIAL</h4>
                    <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="oficial-link" style="text-align: center; margin: 20px 0;">
                    <a href="#" onclick="window.app.openOfficialSite('${this.selectedTramite}')" class="btn-oficial">🌐 Ir al sitio oficial →</a>
                </div>
            </div>
        `;
    },
    
    renderNoticias() {
        return '<div style="margin-bottom: 20px;"><button class="back-btn" onclick="window.app.goBack()">◀️ Atrás</button></div><div class="news-card"><h4>📢 Nueva plataforma de trámites digitales 2025</h4><p>Ya puedes realizar tus trámites desde casa de manera más sencilla</p></div><div class="news-card"><h4>💧 Corte de agua programado en Mérida</h4><p>Martes 15 de abril, colonias Centro y Norte</p></div><div class="news-card"><h4>⚡ Horario especial CFE para pagos</h4><p>Oficinas abiertas sábados de 9am a 1pm</p></div><div class="news-card"><h4>🪪 Nueva versión del CURP digital</h4><p>Ya puedes descargar tu CURP con código QR</p></div>';
    },
    
    renderPerfil() {
        const user = getCurrentUser();
        
        // Modo Texto Grande - Perfil como en la quinta captura
        if (this.accessibilityMode === 'large-text') {
            return `
                <div class="header-blue">
                    <div class="header-with-back">
                        <button class="back-btn-inline" onclick="window.app.goBack()">←</button>
                        <div class="header-text">
                            <h2>INTERFAZ DE PERFIL</h2>
                            <p>Perfil</p>
                        </div>
                    </div>
                </div>
                <div class="profile-card">
                    <div class="profile-avatar">👤</div>
                    <h3>${user?.full_name || 'Juan Carlos Hernández García'}</h3>
                    <p>📧 ${user?.email || 'juan.hernandez@example.com'}</p>
                </div>
                <div class="profile-field"><strong>CURP</strong><span>${user?.curp || 'HEGJB50312HDFRNN09'}</span></div>
                <div class="profile-field"><strong>RFC</strong><span>${user?.rfc || 'HEGJB50312A1B'}</span></div>
                <div class="profile-field"><strong>Teléfono</strong><span>${user?.phone || '+52 55 1234 5678'}</span></div>
                <div class="profile-field"><strong>Dirección</strong><span>${user?.address || 'Av. Reforma 123, Col. Centro, CDMX'}</span></div>
                <button class="btn-primary" style="background: #3b82f6; margin-top: 10px;" onclick="window.app.editProfile()">✏️ Editar Perfil</button>
                <button class="btn-primary" style="background: #dc2626; margin-top: 10px;" onclick="window.app.logout()">🚪 Cerrar Sesión</button>
            `;
        }
        
        // MODO LECTOR DE PANTALLA - Perfil original
        if (this.accessibilityMode === 'screenreader') {
            return '<div style="margin-bottom: 20px;"><button class="back-btn" onclick="window.app.goBack()">◀️ Atrás</button></div><div class="profile-card"><div class="profile-avatar">👤</div><h3>' + (user?.full_name || user?.email?.split('@')[0] || 'Usuario') + '</h3><p>📧 ' + (user?.email || '') + '</p></div><div class="profile-field"><strong>👤 Nombre completo</strong><span>' + (user?.full_name || '—') + '</span></div><div class="profile-field"><strong>📧 Email</strong><span>' + (user?.email || '—') + '</span></div><div class="profile-field"><strong>🪪 CURP</strong><span>' + (user?.curp || 'No registrada') + '</span></div><div class="profile-field"><strong>🏢 RFC</strong><span>' + (user?.rfc || 'No registrado') + '</span></div><div class="profile-field"><strong>📱 Teléfono</strong><span>' + (user?.phone || '—') + '</span></div><button class="btn-primary" style="background: var(--danger); margin-top: 10px;" onclick="window.app.logout()">🚪 Cerrar Sesión</button>';
        }
        
        // Modo normal
        return '<div style="margin-bottom: 20px;"><button class="back-btn" onclick="window.app.goBack()">◀️ Atrás</button></div><div class="profile-card"><div class="profile-avatar">👤</div><h3>' + (user?.full_name || user?.email?.split('@')[0] || 'Usuario') + '</h3><p>📧 ' + (user?.email || '') + '</p></div><div class="profile-field"><strong>👤 Nombre completo</strong><span>' + (user?.full_name || '—') + '</span></div><div class="profile-field"><strong>📧 Email</strong><span>' + (user?.email || '—') + '</span></div><div class="profile-field"><strong>🪪 CURP</strong><span>' + (user?.curp || 'No registrada') + '</span></div><div class="profile-field"><strong>🏢 RFC</strong><span>' + (user?.rfc || 'No registrado') + '</span></div><div class="profile-field"><strong>📱 Teléfono</strong><span>' + (user?.phone || '—') + '</span></div><button class="btn-primary" style="background: var(--danger); margin-top: 10px;" onclick="window.app.logout()">🚪 Cerrar Sesión</button>';
    },
    
    editProfile() {
        showToastMessage('Funcionalidad en desarrollo');
    },
    
    openOfficialSite(tramiteId) {
        const sites = { curp: 'https://www.gob.mx/curp/', rfc: 'https://www.sat.gob.mx/', acta: 'https://www.gob.mx/actadenacimiento', servicios: 'https://www.gob.mx/servicios', agua: 'https://www.capa.gob.mx/', luz: 'https://www.cfe.mx/' };
        const url = sites[tramiteId] || 'https://www.gob.mx/';
        window.open(url, '_blank');
        if (this.accessibilityMode === 'screenreader') this.speakText('Abriendo sitio oficial de ' + this.getTramiteTitle(tramiteId));
    }
};

window.app = App;
document.addEventListener('DOMContentLoaded', () => App.init());