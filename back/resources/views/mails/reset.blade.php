<!DOCTYPE html>
<html lang="es">@include('mails.header')
<body>
<div class="main-container">
    <div><h1><span>¿<span class="greetings"><strong>Tienes problemas para iniciar sesión</strong></span>?</span></h1></div>
    <div class="text-center"><img alt="img" src="{{ config('web_url') }}/images/notificacion-recuperar.png"/></div>
    <p>
        <span>Pulsa el botón y sigue los pasos para restablecer tu contraseña en {{ config('global.app_name') }}.</span>
    </p>
    <div class="button-link"><span class="text-button"><a
                href="{{ config('global.app_url') }}/new-password/{{ $pwdReset->token }}"><strong>Restablecer contraseña</strong></a></span></div>
    <p><span>También puedes copiar y pegar el siguiente enlace en tu navegador:<br></span><span class="small-text"><a
                href="{{ config('global.app_url') }}/new-password/{{ $pwdReset->token }}">{{ config('global.app_url') }}/new-password/{{ $pwdReset->token }}</a></span></p>
    <p>
        <span>¿Sigues teniendo problemas para acceder? No dudes en contactar con nosotros, te atenderemos lo antes posible.</span>
    </p>
    <p>
        <span>Si no solicitaste cambiar tu contraseña, puedes ignorar este correo.</span>
    </p>
</div>
</body>
@include('mails.signature')
</html>
