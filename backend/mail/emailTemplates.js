export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Проверьте свою электронную почту</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="text-align: center; color: #6a1b9a;">Проверка электронной почты</h2>
  <p>Здравсвуйте,</p>
  <p>Пожалуйста, пройдите верификацию аккаунта в личном кабинете,используя код ниже::</p>
  <p style="text-align: center; font-size: 24px; font-weight: bold; color: #6a1b9a;">{verificationCode}</p>
  <p>Этот код истекает через 24 часа по соображениям безопасности.Если вы не зарегистрировались для этой учетной записи, пожалуйста, игнорируйте это сообщение.</p>
  <p>С наилучшими пожеланиями,<br>Команда marketassist</p>
  <footer style="margin-top: 20px; font-size: 0.8em; text-align: center; color: #888;">Это автоматическое сообщение, пожалуйста, не отвечайте на это электронное письмо.</footer>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сброс пароля успешно</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="text-align: center; color: #1e88e5;">Password Reset Confirmation</h2>
  <p>Здравсвуйте,</p>
  <p>Ваш пароль был успешно сброшен. Если вы не запросили об этом, пожалуйста, немедленно свяжитесь с поддержкой.</p>
  <p>Для обеспечения безопасности мы рекомендуем вам:</p>
  <ul style="padding-left: 20px;">
    <li>Используйте сильный, уникальный пароль</li>
    <li>Не используйте один и тот же пароль для нескольких учетных записей</li>
  </ul>
  <p>С наилучшими пожеланиями,<br>Команда marketassist</p>
  <footer style="margin-top: 20px; font-size: 0.8em; text-align: center; color: #888;">Это автоматизированное сообщение, пожалуйста, не отвечайте на это письмо.</footer>
</body>
</html>
`;

export const WELCOMING_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Добро пожаловать в marketassist</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Добро пожаловать в marketassist!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Привет,</p>
    <p>Спасибо, что зарегистрировались в marketassist! Мы рады приветствовать вас в нашем сообществе.</p>
    <p>Ваш аккаунт был успешно создан. Теперь вы можете воспользоваться всеми функциями нашего сервиса.</p>
    <p>Если у вас возникнут вопросы или потребуется помощь, не стесняйтесь обращаться в нашу службу поддержки.</p>
    <p>С наилучшими пожеланиями,<br>Команда marketassist</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Это автоматическое сообщение. Пожалуйста, не отвечайте на него.</p>
  </div>
</body>
</html>
`

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Запрос сброса пароля</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="text-align: center; color: #d32f2f;">Запрос сброса пароля</h2>
  <p>Здравсвуйте,</p>
  <p>Мы получили запрос на сброс вашего пароля. Если вы не делали запрос, пожалуйста, проигнорируйте это письмо.</p>
  <p>Чтобы сбросить пароль, нажмите на ссылку ниже:</p>
  <p style="text-align: center;">
    <a href="{resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #d32f2f; color: #fff; text-decoration: none; border-radius: 4px;">Сбросить пароль</a>
  </p>
  <p>This link will expire in 1 hour for security reasons.</p>
  <p>С наилучшими пожеланиями,<br>Команда marketassist</p>
  <footer style="margin-top: 20px; font-size: 0.8em; text-align: center; color: #888;">Это автоматическое сообщение, пожалуйста, не отвечайте на это электронное письмо.</footer>
</body>
</html>
`;
