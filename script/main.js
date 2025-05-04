/*------------------===------------------*\
            VARIABLES GLOBALES
\*------------------===------------------*/

let currentUser = null
let sideMenuOpen = false



/*-----------------------===-----------------------*\
      [10]. UTILIDADES Y FUNCIONES AUXILIARES
\*-----------------------===-----------------------*/

function generateRandomCode() {
    return Math.floor(1000000000 + Math.random() * 9000000000)
}


/**
 * Función que controla la visibilidad de los elementos de navegación
 * @param {boolean} isLoggedIn - Indica si el usuario ha iniciado sesión
 */
function updateNavigationVisibility(isLoggedIn) {
    const menuToggle = document.getElementById('menuToggle')
    const userIcon = document.querySelector('.user-icon')
    const bottomNav = document.querySelector('.bottom-nav')
    
    if (isLoggedIn) {
        if (menuToggle) menuToggle.style.display = 'flex'
        if (userIcon) userIcon.style.display = 'flex'
        if (bottomNav) bottomNav.style.display = 'flex'
    } else {
        if (menuToggle) menuToggle.style.display = 'none'
        if (userIcon) userIcon.style.display = 'none'
        if (bottomNav) bottomNav.style.display = 'none'
    }
}


/**
 * Función para verificar si el usuario está logueado y redirigir si no lo está
 * Protege las vistas para que solo sean accesibles con sesión iniciada
 */
function checkAuthStatus() {
    const currentView = document.querySelector('.view-active')?.id
    const publicViews = ['loginView', 'registerView']
    
    if (!currentUser && currentView && !publicViews.includes(currentView)) {
        showView('loginView')
        showToast('Debes iniciar sesión para acceder')
        return false
    }
    
    return true
}


/**
 * Función mejorada para mostrar vistas con verificación de autenticación
 * @param {string} viewId - ID del elemento HTML que contiene la vista
 */
function showView(viewId) {
    const publicViews = ['loginView', 'registerView']
    
    if (!publicViews.includes(viewId) && !currentUser) {
        viewId = 'loginView'
        showToast('Debes iniciar sesión para acceder')
    }
    
    document.querySelectorAll('[id$="View"]').forEach(view => {
        view.style.display = 'none'
        view.classList.remove('view-active')
    })
    
    const targetView = document.getElementById(viewId)
    if (targetView) {
        targetView.style.display = 'flex'
        targetView.classList.add('view-active')
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active')
    })
    
    document.querySelectorAll(`.nav-item[data-view="${viewId}"]`).forEach(item => {
        item.classList.add('active')
    })
    
    updateNavigationVisibility(!publicViews.includes(viewId))
    
    if (sideMenuOpen) {
        toggleSideMenu()
    }
}


/**
 * Función simple para hashear contraseñas
 * @param {string} password - Contraseña a hashear
 * @returns {string} Hash hexadecimal de la contraseña
 */
function simpleHash(password) {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash.toString(16)
}


/**
 * @param {string} message - Mensaje a mostrar
 */
function showToast(message) {
    let toast = document.getElementById('toast')
    if (!toast) {
        toast = document.createElement('div')
        toast.id = 'toast'
        toast.className = 'toast'
        document.body.appendChild(toast)
        
        const style = document.createElement('style')
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                text-align: center;
                max-width: 80%;
            }
            
            .toast.show {
                opacity: 1;
            }
        `
        document.head.appendChild(style)
    }
    
    toast.textContent = message
    toast.classList.add('show')
    
    setTimeout(() => {
        toast.classList.remove('show')
    }, 3000)
}


/**
 * Trunca textos largos "Leer más..."
 * @param {string} elementSelector - Selector CSS de los elementos a truncar
 * @param {number} maxLength - Longitud máxima antes de truncar
 */
function truncateTexts(elementSelector, maxLength = 100) {
    document.querySelectorAll(elementSelector).forEach(element => {
        const fullText = element.textContent
        
        if (fullText.length > maxLength) {
            const truncatedText = fullText.substring(0, maxLength) + "..."
            
            element.setAttribute('data-full-text', fullText)
            
            element.innerHTML = `
                <span class="truncated-text">${truncatedText}</span>
                <a href="#" class="read-more-link">Leer más...</a>
            `
            
            const readMoreLink = element.querySelector('.read-more-link')
            readMoreLink.addEventListener('click', function(e) {
                e.preventDefault()
                
                const isExpanded = this.textContent === 'Leer menos'
                
                if (isExpanded) {
                    element.querySelector('.truncated-text').textContent = truncatedText
                    this.textContent = 'Leer más...'
                } else {
                    element.querySelector('.truncated-text').textContent = fullText
                    this.textContent = 'Leer menos'
                }
            })
        }
    })
}



/*------------------===------------------*\
         [11]. GESTIÓN DE VISTAS
\*------------------===------------------*/

/**
 * Controla la apertura y cierre del menú lateral
 */
function toggleSideMenu() {
    sideMenuOpen = !sideMenuOpen
    const menuToggle = document.getElementById('menuToggle')
    const sideMenu = document.getElementById('sideMenu')
    const menuBackdrop = document.getElementById('menuBackdrop')
    
    if (sideMenuOpen) {
        menuToggle.classList.add('active')
        sideMenu.classList.add('active')
        menuBackdrop.classList.add('active')
        document.body.style.overflow = 'hidden' // Prevenir scroll cuando el menú está abierto
    } else {
        menuToggle.classList.remove('active')
        sideMenu.classList.remove('active')
        menuBackdrop.classList.remove('active')
        document.body.style.overflow = '' // Restaurar scroll
    }
}



/*------------------===------------------*\
     [12]. AUTENTICACIÓN DE USUARIOS
\*------------------===------------------*/

/**
 * Registra un nuevo usuario en el sistema
 * @param {string} apodo - Nombre mostrado del usuario
 * @param {string} nickname - Identificador único del usuario
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 */
function registerUser(apodo, nickname, password, confirmPassword) {
    if (!apodo || !nickname || !password || !confirmPassword) {
        showToast('Por favor, completa todos los campos')
        return
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(nickname)) {
        showToast('El nickname solo puede contener letras y números (sin espacios ni símbolos)')
        return
    }
    
    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden')
        return
    }
    
    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres')
        return
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
    if (existingUsers[nickname]) {
        showToast('Este nickname ya está en uso. Por favor, elige otro.')
        return
    }
    
    const code = generateRandomCode()
    
    const user = {
        apodo: apodo,
        nickname: nickname,
        passwordHash: simpleHash(password),
        code: code,
        avatar: null,
        createdAt: new Date().toISOString()
    }
    
    existingUsers[nickname] = user
    localStorage.setItem('horekuUsers', JSON.stringify(existingUsers))
    
    currentUser = user
    localStorage.setItem('horekuCurrentUser', nickname)
    
    updateUserUI()
    
    document.getElementById('registerApodo').value = ''
    document.getElementById('registerNickname').value = ''
    document.getElementById('registerPassword').value = ''
    document.getElementById('registerPasswordConfirm').value = ''
    
    showView('homeView')
    
    showToast(`¡Bienvenido, ${apodo}! Tu registro se ha completado con éxito.`)
}


/**
 * Inicia sesión con un usuario existente
 * @param {string} nicknameOrCode - Nickname o código del usuario
 * @param {string} password - Contraseña
 */
function loginUser(nicknameOrCode, password) {
    if (!nicknameOrCode || !password) {
        showToast('Por favor, ingresa tu nickname/código y contraseña')
        return
    }
    
    const allUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
    let matchedUser = null
    let matchedNickname = null
    
    for (const nickname in allUsers) {
        const user = allUsers[nickname]
        if (user.nickname === nicknameOrCode || user.code.toString() === nicknameOrCode) {
            matchedUser = user
            matchedNickname = nickname
            break
        }
    }
    
    if (!matchedUser) {
        showToast('Usuario no encontrado. Por favor, verifica tu nickname o código.')
        return
    }
    
    if (matchedUser.passwordHash !== simpleHash(password)) {
        showToast('Contraseña incorrecta. Por favor, inténtalo de nuevo.')
        return
    }
    
    currentUser = matchedUser
    localStorage.setItem('horekuCurrentUser', matchedNickname)
    
    updateUserUI()
    
    document.getElementById('loginNickname').value = ''
    document.getElementById('loginPassword').value = ''
    
    showView('homeView')
    
    showToast(`¡Bienvenido de nuevo, ${matchedUser.apodo}!`)
}



/**
 * Cierra la sesión del usuario actual
 */
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        currentUser = null
        localStorage.removeItem('horekuCurrentUser')
        
        document.getElementById('loginNickname').value = ''
        document.getElementById('loginPassword').value = ''
        
        showView('loginView')
        
        showToast('Has cerrado sesión correctamente')
    }
}



/*--------------------===--------------------*\
      [13]. GESTIÓN DE PERFIL DE USUARIO
\*--------------------===--------------------*/

/**
 * [13.1] Descarga la versión específica de HorekuOs
 * @param {string} version - Versión del sistema a descargar
 */
function downloadVersion(version) {
    if (!checkAuthStatus()) return
    
    const button = document.querySelector(`.btn-download[data-version="${version}"]`)
    if (!button) return
    
    const progressBar = button.querySelector('.progress-bar')
    const buttonText = button.querySelector('.btn-text')
    const originalText = buttonText.textContent
    
    const downloadButtons = document.querySelectorAll('.btn-download')
    downloadButtons.forEach(btn => {
        btn.disabled = true
    })
    
    button.classList.add('loading')
    buttonText.textContent = 'Preparando...'
    
    let progress = 0
    const totalTime = 3000
    const interval = 50
    const increment = (interval / totalTime) * 100
    
    const progressInterval = setInterval(() => {
        progress += increment
        progressBar.style.width = `${progress}%`
        
        if (progress < 30) {
            buttonText.textContent = 'Conectando...'
        } else if (progress < 60) {
            buttonText.textContent = 'Descargando...'
        } else if (progress < 90) {
            buttonText.textContent = 'Finalizando...'
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval)
            button.classList.remove('loading')
            button.classList.add('completed')
            buttonText.textContent = '✓ Descargado'
            
            const link = document.createElement('a')
            
            let downloadUrl = ''
            if (version === 'present' || version === 'new') {
                downloadUrl = 'https://files.catbox.moe/f1r243.zip'
            } else {
                downloadUrl = 'https://files.catbox.moe/f1r243.zip'
            }
            
            link.href = downloadUrl
            link.download = `HorekuOs_${version}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            showToast(`HorekuOs ${version} descargado correctamente`)
            
            setTimeout(() => {
                button.classList.remove('completed')
                progressBar.style.width = '0'
                buttonText.textContent = originalText
                
                downloadButtons.forEach(btn => {
                    btn.disabled = false
                })
            }, 3000)
        }
    }, interval)
}


/**
 * Actualiza la interfaz con los datos del usuario actual
 */
function updateUserUI() {
    if (currentUser) {
        document.getElementById('displayName').textContent = `${currentUser.apodo}`
        document.getElementById('displayNickname').textContent = `@${currentUser.nickname}`
        document.getElementById('displayCode').textContent = currentUser.code
        
        if (currentUser.avatar) {
            document.getElementById('userAvatarImg').src = currentUser.avatar
            
            const userIconImg = document.querySelector('.user-icon img')
            if (userIconImg) {
                userIconImg.src = currentUser.avatar
            }
        } else {
            document.getElementById('userAvatarImg').src = './defauld.png'
            
            const userIconImg = document.querySelector('.user-icon img')
            if (userIconImg) {
                userIconImg.src = './defauld.png'
            }
        }
    }
}


/**
 * [13.2] Alterna la visibilidad de los campos de contraseña
 * @param {string} inputId - ID del input de contraseña
 * @param {string} toggleId - ID del botón toggle
 */
function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId)
    const toggleButton = document.getElementById(toggleId)
    
    if (!passwordInput || !toggleButton) return
    
    const toggleIcon = toggleButton.querySelector('i')
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        toggleIcon.classList.remove('fa-eye')
        toggleIcon.classList.add('fa-eye-slash')
    } else {
        passwordInput.type = 'password'
        toggleIcon.classList.remove('fa-eye-slash')
        toggleIcon.classList.add('fa-eye')
    }
}



/*--------------------===--------------------*\
     [14]. INICIALIZACIÓN DE LA APLICACIÓN
\*--------------------===--------------------*/

document.addEventListener('DOMContentLoaded', function() {
    const bottomNav = document.querySelector('.bottom-nav')
    if (bottomNav) {
        const navContainer = document.createElement('div')
        navContainer.className = 'fixed-nav-container'
        document.body.appendChild(navContainer)
        
        const style = document.createElement('style')
        style.textContent = `
            .fixed-nav-container {
                position: fixed;
                bottom: 16px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                z-index: 50;
                padding: 0 16px;
            }
            
            .bottom-nav {
                width: 100%;
                max-width: 480px;
                border-radius: var(--border-radius-md);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            .content {
                padding-bottom: 80px;
            }
            
            .read-more-link {
                color: var(--nav-active);
                text-decoration: none;
                font-weight: 500;
                margin-left: 4px;
                cursor: pointer;
            }
        `
        document.head.appendChild(style)
        
        navContainer.appendChild(bottomNav)
    }
    
    const lastLoggedInUser = localStorage.getItem('horekuCurrentUser')
    if (lastLoggedInUser) {
        const allUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
        if (allUsers[lastLoggedInUser]) {
            currentUser = allUsers[lastLoggedInUser]
            updateUserUI()
            showView('homeView')
        } else {
            showView('loginView')
        }
    } else {
        showView('loginView')
    }
    
    /*-----
       -- [14.1] CONFIGURACIÓN DE EVENT LISTENERS
      -----*/
    
    document.querySelectorAll('.nav-item, .side-menu-option').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault()
            
            const targetView = this.getAttribute('data-view')
            if (targetView) {
                showView(targetView)
            }
        })
    })
    
    document.getElementById('loginButton')?.addEventListener('click', function() {
        const nickname = document.getElementById('loginNickname').value
        const password = document.getElementById('loginPassword').value
        loginUser(nickname, password)
    })
    
    document.getElementById('registerButton')?.addEventListener('click', function() {
        const apodo = document.getElementById('registerApodo').value
        const nickname = document.getElementById('registerNickname').value
        const password = document.getElementById('registerPassword').value
        const confirmPassword = document.getElementById('registerPasswordConfirm').value
        registerUser(apodo, nickname, password, confirmPassword)
    })
    
    document.getElementById('goToRegister')?.addEventListener('click', function(e) {
        e.preventDefault()
        showView('registerView')
    })
    
    document.getElementById('goToLogin')?.addEventListener('click', function(e) {
        e.preventDefault()
        showView('loginView')
    })
    
    document.getElementById('sideMenuLogout')?.addEventListener('click', function(e) {
        e.preventDefault()
        logout()
    })
    
    document.getElementById('logoutOption')?.addEventListener('click', function() {
        logout()
    })
    
    document.getElementById('loginPasswordToggle')?.addEventListener('click', function() {
        togglePasswordVisibility('loginPassword', 'loginPasswordToggle')
    })
    
    document.getElementById('registerPasswordToggle')?.addEventListener('click', function() {
        togglePasswordVisibility('registerPassword', 'registerPasswordToggle')
    })
    
    document.getElementById('registerPasswordConfirmToggle')?.addEventListener('click', function() {
        togglePasswordVisibility('registerPasswordConfirm', 'registerPasswordConfirmToggle')
    })
    
    document.getElementById('menuToggle')?.addEventListener('click', function() {
        toggleSideMenu()
    })
    
    document.getElementById('menuBackdrop')?.addEventListener('click', function() {
        if (sideMenuOpen) {
            toggleSideMenu()
        }
    })
    
    document.getElementById('getStartedButton')?.addEventListener('click', function() {
        showView('downloadView')
    })
    
    
    document.querySelectorAll('.btn-download').forEach(button => {
        button.addEventListener('click', function() {
            const version = this.getAttribute('data-version')
            downloadVersion(version)
        })
    })

    document.getElementById('saveSettingsBtn')?.addEventListener('click', function() {
        showToast('Configuración guardada correctamente')
    })
    
    const currentViewId = document.querySelector('.view-active')?.id
    updateNavigationVisibility(currentUser !== null && currentViewId !== 'loginView' && currentViewId !== 'registerView')
})



/*--------------------------------------------------*\
        © 2025 Syllkom. All rights reserved.
     © Syll's CodeLab 2025. All rights reserved
\*--------------------------------------------------*/