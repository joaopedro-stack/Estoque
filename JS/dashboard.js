document.addEventListener('DOMContentLoaded', function () {
    const sair = document.querySelector('.fa-arrow-right-from-bracket');
    const spanusername = document.querySelector('.username');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Acesso não autorizado');
        window.location.href = 'http://localhost/Estoque%20PHP/index.html';
    }

    sair.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'http://localhost/Estoque%20PHP/index.html';
    });

    spanusername.innerHTML = `${username}`
});