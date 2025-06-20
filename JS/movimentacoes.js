document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Acesso não autorizado');
        window.location.href = 'http://localhost/Estoque%20PHP/index.html';
    }

    fetch('../Back/listar_movimentacoes.php', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(moves => {
            const listaMoves = moves.result;
            const table = document.querySelector('table');
            table.style.display = 'none';
            const semMove = document.querySelector('.sem-move');
            const tbody = document.querySelector('tbody');
            console.log(moves);
            if (moves.sucesso) {
                table.style.display = 'table'
                semMove.style.display = 'none'
                listaMoves.forEach(m => {
                    const linha = `
                    <tr>
                            <td>${m.id}</td>
                            <td>${m.produto_id}</td>
                            <td>${m.usuario_id}</td>
                            <td>${m.tipo}</td>
                            <td>${m.quantidade}</td>
                            <td>R$${m.data_movimentacao}</td>
                            <td class="acoes-td">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash"></i>
                            </td>
                            </tr>`;
                    tbody.insertAdjacentHTML('beforeend', linha);
                });
            } else {
                semMove.style.display = 'block'
                semMove.innerHTML = `${moves.mensagem}`
            }
        })
    const sair = document.querySelector('.fa-arrow-right-from-bracket');
    const newproduct = document.querySelector('.new-product');
    const modal = document.querySelector('.modal')
    const body = document.querySelector('body');
    const cancel = document.querySelector('.cancel')

    fetch('../Back/listar_produtos.php' , {
        method: 'GET' ,
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(prods => {
            const selectProds = document.querySelector('.produtos');
            const listaProds = prods.Produtos;
            listaProds.forEach(l => {
                const option = document.createElement('option');
                option.innerHTML = `${l.nome}`
                selectProds.appendChild(option);

            })
        })

    sair.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'http://localhost/Estoque%20PHP/index.html';
    });


    newproduct.addEventListener('click', function (e) {
        console.log('Botão Clicado');
        e.stopPropagation();
        modal.className = 'modal ativa';
        body.className = 'modal-aberto';
    })

    document.addEventListener('click', function (e) {
        if (modal.classList.contains('ativa') && !modal.contains(e.target) || modalEdit.classList.contains('ativa') && !modalEdit.contains(e.target)) {
            modal.classList.remove('ativa');
            modalEdit.classList.remove('ativa');
            body.classList.remove('modal-aberto');
        }
    })

    cancel.addEventListener('click', function (e) {
        modal.classList.remove('ativa');
        body.classList.remove('modal-aberto');
    })

    const addMove = document.querySelector('.add-move');
    const popup = document.querySelector('.popup');
    const msg = document.querySelector('.msg');
    const popupErro = document.querySelector('.popup-erro');
    const msgErro = document.querySelector('.msg-erro');

    addMove.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(addProd);

        function formatDecimal(valorFormatado) {
            return valorFormatado
                .replace(/[^\d,]/g, '')
                .replace(',', '.');
        }

        const precoVenda = formData.get('preco-venda');
        const precoCompra = formData.get('preco-compra');

        formData.set('preco-venda', formatDecimal(precoVenda));
        formData.set('preco-compra', formatDecimal(precoCompra));

        fetch('../Back/adicionar_produto.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.sucesso) {
                    fetch('../Back/listar_movimentacoes.php', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(moves => {
                            const listaMoves = moves.result;
                            const table = document.querySelector('table');
                            table.style.display = 'none';
                            const semMove = document.querySelector('.sem-move');
                            const tbody = document.querySelector('tbody');
                            console.log(moves);
                            if (moves.sucesso) {
                                table.style.display = 'table'
                                semMove.style.display = 'none'
                                listaMoves.forEach(m => {
                                    const linha = `
                    <tr>
                            <td>${m.id}</td>
                            <td>${m.produto_id}</td>
                            <td>${m.usuario_id}</td>
                            <td>${m.tipo}</td>
                            <td>${m.quantidade}</td>
                            <td>R$${m.data_movimentacao}</td>
                            <td class="acoes-td">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash"></i>
                            </td>
                            </tr>`;
                                    tbody.insertAdjacentHTML('beforeend', linha);
                                });
                            } else {
                                semMove.style.display = 'block'
                                semMove.innerHTML = `${moves.mensagem}`
                            }
                            addProd.reset();
                            modal.classList.remove('ativa');
                            body.classList.remove('modal-aberto');
                            popup.classList.remove('sair');
                            popup.classList.add('enter');
                            setTimeout(() => {
                                popup.classList.remove('enter');
                                popup.classList.add('sair');
                            }, 2000);
                        });
                } else {
                    addProd.reset();
                    modal.classList.remove('ativa');
                    body.classList.remove('modal-aberto');
                    msgErro.innerHTML = `Erro ao adicionar produto: ${data.mensagem}`;
                    popupErro.classList.remove('sair');
                    popupErro.classList.add('enter');
                    setTimeout(() => {
                        popupErro.classList.remove('enter');
                        popupErro.classList.add('sair');
                    }, 2000);
                }
            })
    })

    const tbody = document.querySelector('tbody');
    const modalEdit = document.querySelector('.modal-edit');
    const editMove = document.querySelector('.edit-move');

    tbody.addEventListener('click', function (e) {
        if (e.target.classList.contains('fa-pen-to-square')) {
            e.stopPropagation()
            modalEdit.classList.add('ativa')
            body.classList.add('modal-aberto');

            const linha = e.target.closest('tr');

            const id = linha.children[0].textContent;
            const sku = linha.children[1].textContent;
            const nome = linha.children[2].textContent;
            const tipo = linha.children[3].textContent;
            const qtd = linha.children[4].textContent;
            const precoVenda = linha.children[5].textContent;
            const precoCompra = linha.children[6].textContent;

            modalEdit.querySelector("input[name='id']").value = id;
            modalEdit.querySelector("input[name='sku']").value = sku;
            modalEdit.querySelector("input[name='nome']").value = nome;
            modalEdit.querySelector("select[name='tipo']").value = tipo;
            modalEdit.querySelector("input[name='qtd']").value = qtd;
            modalEdit.querySelector("input[name='preco-venda']").value = precoVenda;
            modalEdit.querySelector("input[name='preco-compra']").value = precoCompra;
        } else if (e.target.classList.contains('fa-trash')) {
            e.stopPropagation();

            const linha = e.target.closest('tr');

            const id = linha.children[0].textContent;

            const formData = new FormData();
            formData.append('id', id);
            popup.classList.remove('sair');
            popup.classList.add('enter');
            setTimeout(() => {
                popup.classList.remove('enter');
                popup.classList.add('sair');
            }, 2000);

            fetch('../Back/delete_produto.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.sucesso) {
                        fetch('../Back/listar_movimentacoes.php', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                            .then(res => res.json())
                            .then(moves => {
                                const listaMoves = moves.result;
                                const table = document.querySelector('table');
                                table.style.display = 'none';
                                const semMove = document.querySelector('.sem-move');
                                const tbody = document.querySelector('tbody');
                                console.log(moves);
                                if (moves.sucesso) {
                                    table.style.display = 'table'
                                    semMove.style.display = 'none'
                                    listaMoves.forEach(m => {
                                        const linha = `
                    <tr>
                            <td>${m.id}</td>
                            <td>${m.produto_id}</td>
                            <td>${m.usuario_id}</td>
                            <td>${m.tipo}</td>
                            <td>${m.quantidade}</td>
                            <td>R$${m.data_movimentacao}</td>
                            <td class="acoes-td">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash"></i>
                            </td>
                            </tr>`;
                                        tbody.insertAdjacentHTML('beforeend', linha);
                                    });
                                } else {
                                    semMove.style.display = 'block'
                                    semMove.innerHTML = `${moves.mensagem}`
                                }
                            })
                    }
                })
        }
    })

    editMove.addEventListener('submit', function (e) {
        e.preventDefault()
        const formData = new FormData(editMove)
        const atualizaID = modalEdit.querySelector('input[name="id"]').value;
        formData.append('id', atualizaID);

        fetch('../Back/editar_produto.php', {
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
                    fetch('../Back/listar_movimentacoes.php', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(moves => {
                            const listaMoves = moves.result;
                            const table = document.querySelector('table');
                            table.style.display = 'none';
                            const semMove = document.querySelector('.sem-move');
                            const tbody = document.querySelector('tbody');
                            console.log(moves);
                            if (moves.sucesso) {
                                table.style.display = 'table'
                                semMove.style.display = 'none'
                                listaMoves.forEach(m => {
                                    const linha = `
                    <tr>
                            <td>${m.id}</td>
                            <td>${m.produto_id}</td>
                            <td>${m.usuario_id}</td>
                            <td>${m.tipo}</td>
                            <td>${m.quantidade}</td>
                            <td>R$${m.data_movimentacao}</td>
                            <td class="acoes-td">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash"></i>
                            </td>
                            </tr>`;
                                    tbody.insertAdjacentHTML('beforeend', linha);
                                });
                            } else {
                                semMove.style.display = 'block'
                                semMove.innerHTML = `${moves.mensagem}`
                            }
                            editMove.reset();
                            modalEdit.classList.remove('ativa');
                            body.classList.remove('modal-aberto');
                            popup.classList.remove('sair');
                            popup.classList.add('enter');
                            setTimeout(() => {
                                popup.classList.remove('enter');
                                popup.classList.add('sair');
                            }, 2000);
                        });
                } else {
                    editMove.reset();
                    modalEdit.classList.remove('ativa');
                    body.classList.remove('modal-aberto');
                    msgErro.innerHTML = `Erro ao editar Produto ${data.mensagem}`;
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
