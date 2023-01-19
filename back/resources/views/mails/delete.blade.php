<!DOCTYPE html>
<html lang="es">@include('mails.header')
<body>
<div class="main-container">
    <div><h1><span>&iexcl;<span class="greetings"><strong>Hola {{ $user->name }}</strong></span>!</span></h1></div>
    <div class="text-center"><img alt="img" src=".{{ config('web_url') }}/images/notificacion-eliminar.png"/></div>
    <p>
        <span>Te informamos de que tu usuario ha sido dado/a de baja en la compañía {{ $company->name }} en {{ config('global.app_name') }}.
            A partir de ahora no tendrás acceso a tu cuenta en esta compañía.</span>
    </p>
</div>
</body>
@include('mails.signature')
</html>
