document.addEventListener('DOMContentLoaded', function() {
    
    let signUp = document.getElementById("signUp");
    let signIn = document.getElementById("signIn");
    let nameInput = document.getElementById("nameInput");
    let title = document.getElementById("title");
    
   
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    
    function isValidPassword(password) {
        
        const passwordRegex = /^(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    }
    
    
    if (signIn) {
        signIn.onclick = function() {
            if (nameInput) {
                nameInput.style.maxHeight = "0";
            }
            if (title) {
                title.innerHTML = "Login";
            }
            
            
            const email = document.querySelector('input[type="email"]').value.trim();
            const password = document.querySelector('input[type="password"]').value.trim();
            
            
            if (!email || !password) {
                alert("Por favor, completa todos los campos");
                return;
            }
            
            
            if (!isValidEmail(email)) {
                alert("Por favor, introduce un correo electrónico válido");
                return;
            }
            
            
            if (!isValidPassword(password)) {
                alert("La contraseña debe tener al menos 6 caracteres y contener al menos un número");
                return;
            }
            
            
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('action', 'login');
            
            
            fetch('auth.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    
                    window.location.href = 'admin/dashboard.php';
                } else {
                    
                    alert(data.message || "Error de autenticación");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error de conexión. Inténtalo de nuevo más tarde.");
            });
        };
    }
    
    
    document.querySelector('form').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (signIn) {
                signIn.click();
            }
        }
    });
});
