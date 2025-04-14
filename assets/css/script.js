window.addEventListener('load', function() {
    const loader = document.querySelector('.loader-container');
    setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500)
    }, 1000)
})


const fadeElements = document.querySelectorAll('.fade-in-up');

const checkFade = () => {
    const triggerBottom = window.innerHeight * 0.8;
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', checkFade);
window.addEventListener('load', checkFade);

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.maxHeight;
        
        document.querySelectorAll('.faq-answer').forEach(item => {
            item.style.maxHeight = null;
        });
        
        document.querySelectorAll('.faq-question').forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                item.querySelector('::after').textContent = '+';
            }
        });
        
        if (!isOpen) {
            question.classList.add('active');
            question.querySelector('::after').textContent = '-';
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

const commandTabs = document.querySelectorAll('.command-tab');
const commandItems = document.querySelectorAll('.command-item');
const commandSearch = document.getElementById('commandSearch');

commandTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        
        commandTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        commandItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

commandSearch.addEventListener('input', () => {
    const searchTerm = commandSearch.value.toLowerCase();
    
    commandItems.forEach(item => {
        const commandName = item.querySelector('.command-name').textContent.toLowerCase();
        const commandDesc = item.querySelector('.command-description').textContent.toLowerCase();
        
        if (commandName.includes(searchTerm) || commandDesc.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    enableDarkMode();
}

themeToggle.addEventListener('click', () => {
    const currentTheme = root.style.getPropertyValue('--background') === '#121212' ? 'light' : 'dark';
    
    if (currentTheme === 'dark') {
        enableDarkMode();
    } else {
        enableLightMode();
    }
    
    localStorage.setItem('theme', currentTheme);
});

function enableDarkMode() {
    root.style.setProperty('--primary', '#bb86fc');
    root.style.setProperty('--secondary', '#03dac6');
    root.style.setProperty('--background', '#121212');
    root.style.setProperty('--surface', '#1e1e1e');
    root.style.setProperty('--text', '#ffffff');
    root.style.setProperty('--text-secondary', '#b0b0b0');
    themeToggle.textContent = '☀️';
    
    const icons = document.querySelectorAll('.feature-icon img');
    icons.forEach(icon => {
        if (icon.alt) {
            const iconName = icon.alt;
            icon.src = `./assets/light-dark/${iconName}_light.png`;
        }
    });
    
    root.setAttribute('data-theme', 'dark');
}

function enableLightMode() {
    root.style.setProperty('--primary', '#6200ea');
    root.style.setProperty('--secondary', '#03dac6');
    root.style.setProperty('--background', '#f5f5f5');
    root.style.setProperty('--surface', '#ffffff');
    root.style.setProperty('--text', '#212121');
    root.style.setProperty('--text-secondary', '#757575');
    themeToggle.textContent = '🌙';
    
    const icons = document.querySelectorAll('.feature-icon img');
    icons.forEach(icon => {
        if (icon.alt) {
            const iconName = icon.alt;
            icon.src = `./assets/light-dark/${iconName}_dark.png`;
        }
    });
    
    root.setAttribute('data-theme', 'light');
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        
        let formatted;
        if (target >= 1000000) {
            formatted = Math.round(current / 100000) / 10 + 'M+';
        } else if (target >= 1000) {
            formatted = Math.round(current / 100) / 10 + 'K+';
        } else {
            formatted = Math.round(current) + '+';
        }
        
        element.textContent = formatted;
    }, 40);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('userCount'), 5000);
            animateCounter(document.getElementById('commandCount'), 60);
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.stats-container');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !subject || !message) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un email válido.');
            return;
        }
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = 'Mensaje Enviado ✓';
            
            setTimeout(() => {
                submitBtn.textContent = 'Enviar Mensaje';
                submitBtn.disabled = false;
            }, 3000);
            
            alert('¡Gracias por tu mensaje! Te responderemos lo antes posible.');
        }, 1500);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});


const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.classList.add('mobile-menu-btn');
mobileMenuBtn.innerHTML = '☲';
document.querySelector('.nav-container').appendChild(mobileMenuBtn);

const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

const style = document.createElement('style');
style.innerHTML = `
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text);
            cursor: pointer;
        }
        
        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--surface);
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .nav-links.show {
            display: flex;
        }
        
        .nav-links li {
            margin: 10px 0;
        }
    }
`;
document.head.appendChild(style);

const lazyImages = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
} else {
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
}

const versionCompare = () => {
    const versionCards = document.querySelectorAll('.version-card');
    
    versionCards.forEach(card => {
        const compareLabel = document.createElement('label');
        compareLabel.classList.add('compare-label');
        compareLabel.innerHTML = '<input type="checkbox" class="compare-check"> Comparar';
        card.appendChild(compareLabel);
    });
    
    const versionsSection = document.getElementById('versions');
    const compareBtn = document.createElement('button');
    compareBtn.textContent = 'Comparar Versiones Seleccionadas';
    compareBtn.classList.add('compare-btn');
    compareBtn.style.display = 'none';
    versionsSection.querySelector('.container').appendChild(compareBtn);
    
    const checkboxes = document.querySelectorAll('.compare-check');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = [...checkboxes].filter(c => c.checked).length;
            
            if (checkedCount >= 2) {
                compareBtn.style.display = 'block';
            } else {
                compareBtn.style.display = 'none';
            }
        });
    });
    
    compareBtn.addEventListener('click', () => {
        const selectedVersions = [...checkboxes]
            .filter(c => c.checked)
            .map(c => {
                const card = c.closest('.version-card');
                return {
                    name: card.querySelector('.version-name').textContent,
                    features: [...card.querySelectorAll('.feature')]
                        .map(f => f.textContent)
                }
            });
        
        if (selectedVersions.length < 2) return;
        
        const modal = document.createElement('div');
        modal.classList.add('comparison-modal');
        
        let tableHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Comparación de Versiones</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Característica</th>
                            ${selectedVersions.map(v => `<th>${v.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        const allFeatures = new Set();
        selectedVersions.forEach(v => {
            v.features.forEach(f => allFeatures.add(f));
        });
        
        allFeatures.forEach(feature => {
            tableHTML += `
                <tr>
                    <td>${feature}</td>
                    ${selectedVersions.map(v => {
                        return v.features.some(f => f === feature) 
                            ? '<td class="check">✓</td>' 
                            : '<td class="cross">✗</td>';
                    }).join('')}
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        modal.innerHTML = tableHTML;
        document.body.appendChild(modal);
        
        const modalStyle = document.createElement('style');
        modalStyle.innerHTML = `
            .comparison-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .modal-content {
                background-color: var(--surface);
                padding: 30px;
                border-radius: 10px;
                max-width: 90%;
                max-height: 90%;
                overflow-y: auto;
                position: relative;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .modal-content table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            
            .modal-content th,
            .modal-content td {
                padding: 10px;
                text-align: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .modal-content th {
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .modal-content td:first-child {
                text-align: left;
            }
        `;
        document.head.appendChild(modalStyle);
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
};

versionCompare();

setTimeout(() => {
    const notification = document.createElement('div');
    notification.classList.add('update-notification');
    notification.innerHTML = `
        <div class="notification-content">
            <h4>¡Nueva actualización disponible!</h4>
            <p>HorekuOs v3.5.1 ya está disponible con correcciones importantes.</p>
            <div class="notification-actions">
                <button class="update-btn">Ver detalles</button>
                <button class="dismiss-btn">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    const notifStyle = document.createElement('style');
    notifStyle.innerHTML = `
        .update-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--surface);
            border-left: 4px solid var(--primary);
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 100;
            max-width: 350px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            animation: slideIn 0.3s forwards;
        }
        
        @keyframes slideIn {
            to {
                transform: translateX(0);
            }
        }
        
        .notification-content h4 {
            margin: 0 0 5px;
        }
        
        .notification-content p {
            margin: 0 0 10px;
            color: var(--text-secondary);
        }
        
        .notification-actions {
            display: flex;
            gap: 10px;
        }
        
        .update-btn {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
        }
        
        .dismiss-btn {
            background-color: transparent;
            border: 1px solid var(--text-secondary);
            color: var(--text);
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(notifStyle);
    
    document.querySelector('.dismiss-btn').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    document.querySelector('.update-btn').addEventListener('click', () => {
        window.location.href = '#versions';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}, 5000);