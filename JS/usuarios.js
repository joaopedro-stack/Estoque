document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Acesso não autorizado');
        window.location.href = 'http://localhost/Estoque%20PHP/index.html';
    }
    fetch('../Back/listar_usuarios.php', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(usuarios => {
            const listaUser = usuarios.Usuarios
            const tbody = document.querySelector('tbody');
            listaUser.forEach(u => {
                const linha = ` <tr>
            <td>${u.iduser}</td>
            <td>${u.nome}</td>
            <td>${u.usuario}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td class="acoes-td">
            <i class="fa-solid fa-pen-to-square"></i>
            <i class="fa-solid fa-trash"></i>
            </td>
            </tr>`;
                tbody.insertAdjacentHTML('beforeend', linha);
            });
        })
    const sair = document.querySelector('.fa-arrow-right-from-bracket');
    const newuser = document.querySelector('.new-user');
    const modal = document.querySelector('.modal')
    const body = document.querySelector('body');
    const cancel = document.querySelector('.cancel')

    sair.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'http://localhost/Estoque%20PHP/index.html';
    });


    newuser.addEventListener('click', function (e) {
        e.stopPropagation();
        modal.className = 'modal ativa';
        body.className = 'modal-aberto';
    })

    document.addEventListener('click', function (e) {
        if (modal.classList.contains('ativa') && !modal.contains(e.target)) {
            modal.classList.remove('ativa');
            body.classList.remove('modal-aberto');
        } else if (modaledit.classList.contains('ativa') && !modaledit.contains(e.target)) {
            modaledit.classList.remove('ativa');
            body.classList.remove('modal-aberto');
        }
    })
    cancel.addEventListener('click', function (e) {
        modal.classList.remove('ativa');
        body.classList.remove('modal-aberto');
    })

    const popup = document.querySelector('.popup');
    const popupErro = document.querySelector('.popup-erro');
    const msg = document.querySelector('.msg');
    const msgErro = document.querySelector('.msg-erro');
    const addForm = document.querySelector('.add-form');

    addForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(addForm);

        fetch('../Back/adicionar_usuario.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                msg.innerHTML = `${data.mensagem}`
                if (data.sucesso) {
                    fetch('../Back/listar_usuarios.php', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(usuarios => {
                            const listaUser = usuarios.Usuarios
                            const tbody = document.querySelector('tbody');
                            tbody.innerHTML = ``
                            listaUser.forEach(u => {
                                const linha = ` <tr>
                                                    <td>${u.iduser}</td>
                                                    <td>${u.nome}</td>
                                                    <td>${u.usuario}</td>
                                                    <td>${u.email}</td>
                                                    <td>${u.role}</td>
                                                    <td class="acoes-td">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                    <i class="fa-solid fa-trash"></i>
                                                    </td>
                                                </tr>`;
                                tbody.insertAdjacentHTML('beforeend', linha);
                            });
                        })
                    addForm.reset();
                    modal.classList.remove('ativa');
                    body.classList.remove('modal-aberto');
                    popup.classList.remove('sair');
                    popup.classList.add('enter');
                    setTimeout(() => {
                        popup.classList.remove('enter');
                        popup.classList.add('sair');
                    }, 2000);
                } else {
                    modal.classList.remove('ativa');
                    body.classList.remove('modal-aberto');
                    msgErro.innerHTML = `Erro ao adicionar usuário: ${data.erro}`;
                    popupErro.classList.remove('sair');
                    popupErro.classList.add('enter');
                    setTimeout(() => {
                        popupErro.classList.remove('enter');
                        popupErro.classList.add('sair');
                    }, 2000);
                }
            })
            .catch(err => console.error('Erro na requisição:', err));
    });

    const tbody = document.querySelector('tbody')
    const modaledit = document.querySelector('.modal-edit');
    const editForm = document.querySelector('.edit-form');

    tbody.addEventListener('click', function (e) {
        if (e.target.classList.contains('fa-pen-to-square')) {
            e.stopPropagation();
            modaledit.className = 'modal ativa';
            body.className = 'modal-aberto';
            const linha = e.target.closest('tr');

            const id = linha.children[0].textContent;
            const nome = linha.children[1].textContent;
            const usuario = linha.children[2].textContent;
            const email = linha.children[3].textContent;
            const role = linha.children[4].textContent;

            modaledit.querySelector('input[name="id"]').value = id;
            modaledit.querySelector('input[name="nome"]').value = nome;
            modaledit.querySelector('input[name="usuario"]').value = usuario;
            modaledit.querySelector('input[name="email"]').value = email;
            modaledit.querySelector('select[name="role"]').value = role;
        }
        else if (e.target.classList.contains('fa-trash')) {
            e.stopPropagation();
            const linha = e.target.closest('tr');

            const id = linha.children[0].textContent;
            const formData = new FormData();
            formData.append('id', id);

            fetch('../Back/delete_usuario.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    msg.innerHTML = `${data.mensagem}`
                    fetch('../Back/listar_usuarios.php', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(usuarios => {
                            const listaUser = usuarios.Usuarios
                            const tbody = document.querySelector('tbody');
                            tbody.innerHTML = ``;
                            listaUser.forEach(u => {
                                const linha = ` <tr>
                                                    <td>${u.iduser}</td>
                                                    <td>${u.nome}</td>
                                                    <td>${u.usuario}</td>
                                                    <td>${u.email}</td>
                                                    <td>${u.role}</td>
                                                    <td class="acoes-td">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                    <i class="fa-solid fa-trash"></i>
                                                    </td>
                                                </tr>`;
                                tbody.insertAdjacentHTML('beforeend', linha);
                            });
                            popup.classList.remove('sair');
                            popup.classList.add('enter');
                            setTimeout(() => {
                                popup.classList.remove('enter');
                                popup.classList.add('sair');
                            }, 2000);
                        })
                })
        }
    })

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(editForm);
        const atualizaID = modaledit.querySelector('input[name="id"]').value;
        formData.append('id', atualizaID);
        fetch('../Back/editar_usuario.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.sucesso) {
                    msg.innerHTML = `${data.mensagem}`;
                    fetch('../Back/listar_usuarios.php', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(usuarios => {
                            const listaUser = usuarios.Usuarios;
                            tbody.innerHTML = ''
                            listaUser.forEach(u => {
                                const linha = ` <tr>
                                                    <td>${u.iduser}</td>
                                                    <td>${u.nome}</td>
                                                    <td>${u.usuario}</td>
                                                    <td>${u.email}</td>
                                                    <td>${u.role}</td>
                                                    <td class="acoes-td">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                    <i class="fa-solid fa-trash"></i>
                                                    </td>
                                                </tr>`;
                                tbody.insertAdjacentHTML('beforeend', linha);
                                editForm.reset();
                                modaledit.classList.remove('ativa');
                                body.classList.remove('modal-aberto');
                                popup.classList.remove('sair');
                                popup.classList.add('enter');
                                setTimeout(() => {
                                    popup.classList.remove('enter');
                                    popup.classList.add('sair');
                                }, 2000);
                            });
                        })
                } else {
                    editForm.reset();
                    modaledit.classList.remove('ativa');
                    body.classList.remove('modal-aberto');
                    msgErro.innerHTML = `Erro ao editar usuário ${data.mensagem}`;
                    popupErro.classList.remove('sair');
                    popupErro.classList.add('enter');
                    setTimeout(() => {
                        popupErro.classList.remove('enter');
                        popupErro.classList.add('sair');
                    }, 2000);
                }
            })
            .catch(erro => {
                console.error("Erro ao carregar produtos:", erro);
            });
    })
});
