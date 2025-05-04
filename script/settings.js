/**
 * FUNCIONALIDAD PARA LA SECCIÓN DE AJUSTES
 * - Cambio de temas
 * - Ajuste de tamaño de texto
 * - Gestión de notificaciones
 */



/*---------------------===---------------------*\
     [20]. CONFIGURACIÓN TEMAS Y TEMPORADAS
\*---------------------===---------------------*/

/**
 * [20.1] Configuración
 */
document.addEventListener('DOMContentLoaded', function() {
    const themeOptions = document.querySelectorAll('.theme-option')
    const textSizeSlider = document.getElementById('textSizeSlider')
    const decreaseTextBtn = document.getElementById('decreaseTextBtn')
    const increaseTextBtn = document.getElementById('increaseTextBtn')
    const textSizeLabel = document.querySelector('.text-size-label')
    const textSizeSample = document.querySelector('.text-size-sample')
    const saveSettingsBtn = document.getElementById('saveSettingsBtn')
    
    let currentTheme = 'default'
    let currentTextSize = 3
    
    loadSettings()
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme')
            selectTheme(theme)
        })
    })
    
    textSizeSlider.addEventListener('input', function() {
        const size = parseInt(this.value)
        updateTextSize(size)
    })
    
    decreaseTextBtn.addEventListener('click', function() {
        if (currentTextSize > 1) {
            updateTextSize(currentTextSize - 1)
            textSizeSlider.value = currentTextSize
        }
    })
    
    increaseTextBtn.addEventListener('click', function() {
        if (currentTextSize < 5) {
            updateTextSize(currentTextSize + 1)
            textSizeSlider.value = currentTextSize
        }
    })
    
    saveSettingsBtn.addEventListener('click', function() {
        saveSettings()
        showToast('Configuración guardada')
    })
    
    /**
     * Selecciona un tema y actualiza la interfaz
     */
    function selectTheme(theme) {
        themeOptions.forEach(option => {
            option.classList.remove('active')
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active')
            }
        })
        
        currentTheme = theme
        applyTheme(theme)
    }
    
    /**
     * Aplica el tema seleccionado a la aplicación
     */
    function applyTheme(theme) {
        document.body.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                document.body.classList.remove(className)
            }
        })
        
        document.body.classList.add(`theme-${theme}`)
        
        removeSeasonalEffects()
        if (theme === 'autumn') {
            applyAutumnEffect()
        } else if (theme === 'winter') {
            applyWinterEffect()
        } else if (theme === 'spring') {
            applySpringEffect()
        } else if (theme === 'summer') {
            applySummerEffect()
        }
    }
    
    /**
     * Actualiza el tamaño de texto en la aplicación
     */
    function updateTextSize(size) {
        currentTextSize = size
        
        const sizeLabels = ['Muy pequeño', 'Pequeño', 'Normal', 'Grande', 'Muy grande']
        textSizeLabel.textContent = sizeLabels[size - 1]
        
        const sizeFactor = 0.8 + (size * 0.2) // 1, 1.2, 1.4, 1.6, 1.8
        textSizeSample.style.transform = `scale(${sizeFactor})`
        
        document.documentElement.style.setProperty('--text-size-factor', sizeFactor)
    }
    
    /**
     * Guarda la configuración en localStorage
     */
    function saveSettings() {
        const settings = {
            theme: currentTheme,
            textSize: currentTextSize,
            pushNotifications: document.getElementById('pushNotificationToggle').checked,
            soundNotifications: document.getElementById('soundNotificationToggle').checked
        }
        
        localStorage.setItem('horekuSettings', JSON.stringify(settings))
    }
    
    /**
     * Carga la configuración desde localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('horekuSettings')
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            
            if (settings.theme) {
                selectTheme(settings.theme)
            }
            
            if (settings.textSize) {
                updateTextSize(settings.textSize)
                textSizeSlider.value = settings.textSize
            }
            
            if (settings.pushNotifications !== undefined) {
                document.getElementById('pushNotificationToggle').checked = settings.pushNotifications
            }
            
            if (settings.soundNotifications !== undefined) {
                document.getElementById('soundNotificationToggle').checked = settings.soundNotifications
            }
        }
    }
    
    function showToast(message) {
        let toast = document.getElementById('toast')
        if (!toast) {
            toast = document.createElement('div')
            toast.id = 'toast'
            toast.classList.add('toast')
            document.body.appendChild(toast)
        }
        
        toast.textContent = message
        toast.classList.add('show')
        
        setTimeout(() => {
            toast.classList.remove('show')
        }, 3000)
    }
    
    /**
     * Elimina todos los efectos de temporada
     */
    function removeSeasonalEffects() {
        const existingEffects = document.querySelectorAll('.seasonal-effect')
        existingEffects.forEach(effect => effect.remove())
    }
    
    
    
    /*----
      -- [20.2] CONFIGURACIÓN DE TEMPORADAS
     ---*/
     
    /**
     * Efecto de otoño (🍂)
     */
    function applyAutumnEffect() {
        const container = document.createElement('div')
        container.classList.add('seasonal-effect', 'autumn-leaves')
        document.body.appendChild(container)
        
        for (let i = 0; i < 20; i++) {
            createLeaf(container)
        }
    }
    
    function createLeaf(container) {
        const leaf = document.createElement('i')
        leaf.classList.add('fas', 'fa-leaf', 'leaf')
        leaf.style.left = Math.random() * 100 + 'vw'
        leaf.style.animationDuration = 5 + Math.random() * 10 + 's'
        leaf.style.animationDelay = Math.random() * 5 + 's'
        
        const autumnColors = ['#FFB74D', '#FF8A65', '#A1887F', '#8D6E63', '#D84315']
        leaf.style.color = autumnColors[Math.floor(Math.random() * autumnColors.length)]
        
        container.appendChild(leaf)
    }
    
    /**
     * Efecto de invierno (❄️)
     */
    function applyWinterEffect() {
        const container = document.createElement('div')
        container.classList.add('seasonal-effect', 'winter-snow')
        document.body.appendChild(container)
        
        for (let i = 0; i < 30; i++) {
            createSnowflake(container)
        }
    }
    
    function createSnowflake(container) {
        const snowflake = document.createElement('i')
        snowflake.classList.add('fas', 'fa-snowflake', 'snowflake')
        snowflake.style.left = Math.random() * 100 + 'vw'
        snowflake.style.animationDuration = 5 + Math.random() * 10 + 's'
        snowflake.style.animationDelay = Math.random() * 5 + 's'
        snowflake.style.opacity = 0.5 + Math.random() * 0.5
        snowflake.style.fontSize = 5 + Math.random() * 15 + 'px'
        
        container.appendChild(snowflake)
    }
    
    /**
     * Efecto de primavera (🌸)
     */
    function applySpringEffect() {
        const container = document.createElement('div')
        container.classList.add('seasonal-effect', 'spring-flowers')
        document.body.appendChild(container)
        
        const springIcons = ['fa-seedling', 'fa-spa', 'fa-leaf']
        const springColors = ['#FFEB3B', '#CDDC39', '#8BC34A', '#4CAF50', '#E91E63']
        
        for (let i = 0; i < 15; i++) {
            const el = document.createElement('i')
            el.classList.add('fas', springIcons[Math.floor(Math.random() * springIcons.length)], 'spring-element')
            el.style.left = Math.random() * 100 + 'vw'
            el.style.top = Math.random() * 100 + 'vh'
            el.style.animationDuration = 15 + Math.random() * 30 + 's'
            el.style.color = springColors[Math.floor(Math.random() * springColors.length)]
            
            container.appendChild(el)
        }
    }
    
    /**
     * Efecto de verano (⛱️)
     */
    function applySummerEffect() {
        const container = document.createElement('div')
        container.classList.add('seasonal-effect', 'summer-sun')
        document.body.appendChild(container)
        
        const sun = document.createElement('div')
        sun.classList.add('summer-sun-element')
        container.appendChild(sun)
        
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div')
            ray.classList.add('sun-ray')
            ray.style.transform = `rotate(${i * 30}deg)`
            sun.appendChild(ray)
        }
    }
})



/*--------------------------------------------------*\
        © 2025 Syllkom. All rights reserved.
     © Syll's CodeLab 2025. All rights reserved
\*--------------------------------------------------*/