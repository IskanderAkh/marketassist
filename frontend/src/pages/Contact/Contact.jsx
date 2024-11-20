import React from 'react'
import Container from "@/components/ui/Container";
import illustration_contact from "@/assets/images/illustration_contact.svg"
import tg_icon from "@/assets/images/tg_icon.svg"
const Contact = () => {
  return (
    <Container>
      <section className='contact flex flex-col mt-28'>
        <h1 className='uppercase page-title gradient-color mx-auto'>контакты</h1>
        <h4 className='contact-subtitle mx-auto mt-12 font-rfSemibold'>Поделитесь своим мнением
          о сервисе <span className='gradient-color font-rfBlack'><span className='font-rfUltralightItalic contact-subtitle-span'>Market</span>Аssist</span> </h4>
        <div className='flex items-center justify-center'>
          <img src={illustration_contact} alt="" />
        </div>
        <div className='flex items-center justify-center flex-col contact-text'>
          <p className='text-center font-rfSemibold'>Вам требуется техническая консультация <br /> или Вы хотите сообщить об ошибке?<br /> Свяжитесь с нашей службой поддержки!</p>
          <a target='_blank' href='https://t.me/marketassist_support' className="try-btn font-rfBold flex items-center gap-4 mb-28"><img src={tg_icon} alt="" /> MarketAssist_Support</a>
          <p className='text-center font-rfSemibold'>Для нас важно получать обратную связь от <br /> пользователя! Если у Вас есть предложения<br /> по улучшению сервиса опишите их.<br />
            Наша команда рассмотрит ваше обращение <br />и даст Вам обратную связь!</p>
        </div>
      </section>
    </Container>
  )
}

export default Contact