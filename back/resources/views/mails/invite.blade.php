<!DOCTYPE html>
<html lang="es">@include('mails.header')
<body>
<div class="main-container">
    <div><h1><span>&iexcl;<span class="greetings"><strong>Hola</strong></span>!</span></h1></div>
    <div class="text-center"><img alt="img" src="{{ config('web_url') }}/images/notificacion.png" /></div>
    <p>
        <span>Has recibido una invitación para unirte a <strong>{{ $invite->company->name }} como {{ $invite->role->name }}</strong>.</span>
    </p>
    <div class="button-link"><span class="text-button"><a
                href="{{ config('global.app_url') }}/invite-signup?token={{ $invite->token }}"><strong>¡Aceptar invitación!</strong></a></span></div>
    <p><span class="small-text">También puedes copiar y pegar el siguiente enlace en tu navegador:<br></span><span class="small-text"><a
                href="{{ config('global.app_url') }}/invite-signup?token={{ $invite->token }}">{{ config('global.app_url') }}/invite-signup?token={{ $invite->token }}</a></span></p>
</div>
</body>
@include('mails.signature')
</html>
