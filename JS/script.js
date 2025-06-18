$(document).ready(function () {
    $('.cadastro').on('click', function () {
        var shapeLeft = $('.left');
        var shapeRight = $('.right');
        var register = $('.register');
        shapeLeft.removeClass('entrar sair');
        shapeRight.removeClass('entrar sair');
        shapeLeft.addClass('sair');
        shapeRight.addClass('entrar');
        register.addClass('piscando');
    });

    $('.voltar-login').on('click', function () {
        var shapeLeft = $('.left');
        var shapeRight = $('.right');
        shapeLeft.removeClass('entrar sair');
        shapeRight.removeClass('entrar sair');
        shapeLeft.addClass('entrar');
        shapeRight.addClass('sair');
        register.removeClass('piscando');
    });
});
