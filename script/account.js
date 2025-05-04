/*---------------------===---------------------*\
      [15]. FUNCIONES PARA VISTAS DE CUENTA
\*---------------------===---------------------*/

/**
 * Muestra la vista de cambio de avatar
 */
function showAvatarChangeView() {
    if (!checkAuthStatus()) return
    
    document.querySelectorAll('[id$="View"]').forEach(view => {
        view.style.display = 'none'
        view.classList.remove('view-active')
    })
    
    const avatarView = document.getElementById('avatarChangeView')
    avatarView.style.display = 'flex'
    avatarView.classList.add('view-active')
    avatarView.classList.add('view-transition')
    
    const previewAvatar = document.getElementById('previewAvatar')
    if (currentUser && currentUser.avatar) {
        previewAvatar.src = currentUser.avatar
    } else {
        previewAvatar.src = './defauld.png'
    }
    
    document.getElementById('fileInfo').textContent = 'No se ha seleccionado ningún archivo'
    document.getElementById('saveAvatarBtn').disabled = true
}


/**
 * [15.1] Muestra la vista de edición de perfil
 */
function showProfileEditView() {
    if (!checkAuthStatus()) return
    
    document.querySelectorAll('[id$="View"]').forEach(view => {
        view.style.display = 'none'
        view.classList.remove('view-active')
    })
    
    const profileView = document.getElementById('profileEditView')
    profileView.style.display = 'flex'
    profileView.classList.add('view-active')
    profileView.classList.add('view-transition')
    
    if (currentUser) {
        document.getElementById('editApodo').value = currentUser.apodo || ''
        document.getElementById('editNickname').value = currentUser.nickname || ''
    }
}


/**
 * [15.2] Muestra la vista de cambio de contraseña
 */
function showPasswordChangeView() {
    if (!checkAuthStatus()) return
    
    document.querySelectorAll('[id$="View"]').forEach(view => {
        view.style.display = 'none'
        view.classList.remove('view-active')
    })
    
    const passwordView = document.getElementById('passwordChangeView')
    passwordView.style.display = 'flex'
    passwordView.classList.add('view-active')
    passwordView.classList.add('view-transition')
    
    document.getElementById('currentPassword').value = ''
    document.getElementById('newPassword').value = ''
    document.getElementById('confirmNewPassword').value = ''
}


/**
 * [15.3] Guarda la nueva foto de perfil
 */
function saveNewAvatar() {
    const fileInput = document.getElementById('avatarFileInput')
    const file = fileInput.files[0]
    
    if (!file) {
        showToast('No has seleccionado ninguna imagen')
        return
    }
    
    const reader = new FileReader()
    reader.onload = function(event) {
        const imageDataUrl = event.target.result
        
        currentUser.avatar = imageDataUrl
        
        const allUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
        allUsers[currentUser.nickname] = currentUser
        localStorage.setItem('horekuUsers', JSON.stringify(allUsers))
        
        document.getElementById('userAvatarImg').src = imageDataUrl
        
        const userIconImg = document.querySelector('.user-icon img')
        if (userIconImg) {
            userIconImg.src = imageDataUrl
        }
        
        showToast('Foto de perfil actualizada correctamente')
        showView('accountView')
    }
    
    reader.readAsDataURL(file)
}


/**
 * [15.4] Guarda los cambios del perfil
 */
function saveProfileChanges() {
    const newApodo = document.getElementById('editApodo').value.trim()
    const newNickname = document.getElementById('editNickname').value.trim()
    
    if (!newApodo) {
        showToast('El apodo no puede estar vacío')
        return
    }
    
    if (!newNickname) {
        showToast('El nickname no puede estar vacío')
        return
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(newNickname)) {
        showToast('El nickname solo puede contener letras y números (sin espacios ni símbolos)')
        return
    }
    
    if (newNickname !== currentUser.nickname) {
        const allUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
        if (allUsers[newNickname]) {
            showToast('Este nickname ya está en uso. Por favor, elige otro.')
            return
        }
    }
    
    const allUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
    
    if (newNickname !== currentUser.nickname) {
        delete allUsers[currentUser.nickname]
        currentUser.nickname = newNickname
        localStorage.setItem('horekuCurrentUser', newNickname)
    }
    
    currentUser.apodo = newApodo
    allUsers[newNickname] = currentUser
    
    localStorage.setItem('horekuUsers', JSON.stringify(allUsers))
    
    updateUserUI()
    
    showToast('Perfil actualizado correctamente')
    showView('accountView')
}


/**
 * [15.5] Guarda la nueva contraseña
 */
function savePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value
    const newPassword = document.getElementById('newPassword').value
    const confirmNewPassword = document.getElementById('confirmNewPassword').value
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showToast('Por favor, completa todos los campos')
        return
    }
    
    if (simpleHash(currentPassword) !== currentUser.passwordHash) {
        showToast('Contraseña actual incorrecta')
        return
    }
    
    if (newPassword.length < 6) {
        showToast('La nueva contraseña debe tener al menos 6 caracteres')
        return
    }
    
    if (newPassword !== confirmNewPassword) {
        showToast('Las contraseñas no coinciden')
        return
    }
    
    currentUser.passwordHash = simpleHash(newPassword)
    
    const allUsers = JSON.parse(localStorage.getItem('horekuUsers')) || {}
    allUsers[currentUser.nickname] = currentUser
    localStorage.setItem('horekuUsers', JSON.stringify(allUsers))
    
    showToast('Contraseña actualizada con éxito')
    showView('accountView')
}



/*-----------------------===-----------------------*\
     [16]. EVENT LISTENERS PARA VISTAS DE CUENTA
\*-----------------------===-----------------------*/

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('changeAvatarOption')?.addEventListener('click', function() {
        showAvatarChangeView()
    })
    
    document.getElementById('changeNameOption')?.addEventListener('click', function() {
        showProfileEditView()
    })
    
    document.getElementById('changePasswordOption')?.addEventListener('click', function() {
        showPasswordChangeView()
    })
    
    document.getElementById('avatarFileInput')?.addEventListener('change', function(e) {
        const file = e.target.files[0]
        if (!file) return
        
        if (!file.type.startsWith('image/')) {
            showToast('Por favor selecciona una imagen válida')
            return
        }
        
        if (file.size > 5 * 1024 * 1024) {  // 5MB máximo
            showToast('La imagen es demasiado grande. Máximo 5MB permitido')
            return
        }
        
        document.getElementById('fileInfo').textContent = `Archivo: ${file.name} (${Math.round(file.size / 1024)} KB)`
        
        document.getElementById('saveAvatarBtn').disabled = false
        
        const reader = new FileReader()
        reader.onload = function(event) {
            document.getElementById('previewAvatar').src = event.target.result
        }
        reader.readAsDataURL(file)
    })
    
    document.getElementById('saveAvatarBtn')?.addEventListener('click', function() {
        saveNewAvatar()
    })
    
    document.getElementById('cancelAvatarBtn')?.addEventListener('click', function() {
        showView('accountView')
    })
    
    document.getElementById('saveProfileBtn')?.addEventListener('click', function() {
        saveProfileChanges()
    })
    
    document.getElementById('cancelProfileBtn')?.addEventListener('click', function() {
        showView('accountView')
    })
    
    document.getElementById('savePasswordBtn')?.addEventListener('click', function() {
        savePasswordChange()
    })
    
    document.getElementById('cancelPasswordBtn')?.addEventListener('click', function() {
        showView('accountView')
    })
    
    document.getElementById('currentPasswordToggle')?.addEventListener('click', function() {
        togglePasswordVisibility('currentPassword', 'currentPasswordToggle')
    })
    
    document.getElementById('newPasswordToggle')?.addEventListener('click', function() {
        togglePasswordVisibility('newPassword', 'newPasswordToggle')
    })
    
    document.getElementById('confirmNewPasswordToggle')?.addEventListener('click', function() {
        togglePasswordVisibility('confirmNewPassword', 'confirmNewPasswordToggle')
    })
})



/*--------------------------------------------------*\
        © 2025 Syllkom. All rights reserved.
     © Syll's CodeLab 2025. All rights reserved
\*--------------------------------------------------*/