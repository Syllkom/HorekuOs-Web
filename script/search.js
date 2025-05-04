/**
 * MÓDULO DE BÚSQUEDA Y NAVEGACIÓN
 * Este archivo maneja la funcionalidad de búsqueda de comandos y navegación entre vistas
 */



/*------------------===------------------*\
         [17]. MODULO - SEARCH
\*------------------===------------------*/

const CommandSearch = {
    /**
     * Inicializa la búsqueda de comandos
     */
    init: function() {
        this.searchInput = document.getElementById('commandSearchInput')
        this.commandCards = document.querySelectorAll('.command-card')
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this))
        }
        
        this.initCategoryFilters()
    },
    
    /**
     * Maneja el evento de búsqueda
     * @param {Event} event - El evento de input
     */
    handleSearch: function(event) {
        const searchTerm = event.target.value.toLowerCase()
        
        this.commandCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase()
            const description = card.querySelector('p').innerText.toLowerCase()
            const commands = Array.from(card.querySelectorAll('code')).map(code => code.innerText.toLowerCase())
            
            const matchesSearch = 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                commands.some(cmd => cmd.includes(searchTerm))
            
            card.style.display = matchesSearch ? 'block' : 'none'
        })
    },
    
    
    /**
     * Inicializa los filtros de categoría
     */
    initCategoryFilters: function() {
        const categoryButtons = document.querySelectorAll('.category-btn')
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                categoryButtons.forEach(btn => btn.classList.remove('active'))
                
                this.classList.add('active')
                
                const category = this.dataset.category
                
                CommandSearch.commandCards.forEach(card => {
                    card.style.display = 'block'
                })
                
                CommandSearch.filterByCategory(category)
            })
        })
    },
    
    
    /**
     * Filtra las tarjetas de comandos por categoría
     * @param {string} category - La categoría a filtrar
     */
    filterByCategory: function(category) {
        this.commandCards.forEach(card => {
            if (category === 'todos' || card.dataset.category === category) {
                card.style.display = 'block'
            } else {
                card.style.display = 'none'
            }
        })
        
    }
}



/*------------------===------------------*\
         [18]. MODULO - NAVEGACIÓN 
\*------------------===------------------*/

/**
 * Controlador de navegación para manejar cambios entre vistas
 */
const NavigationController = {

    /**
     * Inicializa los controladores de navegación
     */
    init: function() {
        const sideMenuOptions = document.querySelectorAll('.side-menu-option')
        sideMenuOptions.forEach(option => {
            option.addEventListener('click', function() {
                const view = this.dataset.view
                if (view) {
                    NavigationController.switchView(view)
                }
            })
        })
    },
    
    
    /**
     * Cambia la vista activa
     * @param {string} viewId - El ID de la vista a mostrar
     */
    switchView: function(viewId) {
        const views = document.querySelectorAll('#loginView, #registerView, #homeView, #accountView, #documentsView, #supportView, #settingsView, #downloadView, #termsView')
        views.forEach(view => {
            view.classList.remove('view-active')
        })
        
        const targetView = document.getElementById(viewId)
        if (targetView) {
            targetView.classList.add('view-active')
        }
        
        this.updateBottomNav(viewId)
        this.closeSideMenu()
    },
    
    
    /**
     * Actualiza la navegación inferior basado en la vista activa
     * @param {string} activeViewId - El ID de la vista activa
     */
    updateBottomNav: function(activeViewId) {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item')
        navItems.forEach(item => {
            item.classList.remove('active')
            if (item.dataset.view === activeViewId) {
                item.classList.add('active')
            }
        })
    },
    
    closeSideMenu: function() {
        const sideMenu = document.getElementById('sideMenu')
        const menuBackdrop = document.getElementById('menuBackdrop')
        if (sideMenu && menuBackdrop) {
            sideMenu.classList.remove('active')
            menuBackdrop.classList.remove('active')
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    CommandSearch.init()
    NavigationController.init()
    
})

window.switchView = NavigationController.switchView.bind(NavigationController)



/*--------------------------------------------------*\
        © 2025 Syllkom. All rights reserved.
     © Syll's CodeLab 2025. All rights reserved
\*--------------------------------------------------*/