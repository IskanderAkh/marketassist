import Container from "@/components/ui/Container";
import hero_image from "@/assets/images/hero_illustration1.png"
import { offers } from "@/lib/offers"
import illustration_1 from "@/assets/images/illustration_1-1.png"
import illustration_2 from "@/assets/images/illustration_2.png"
import shadow from "@/assets/images/shadow.png"
export default function HomeDescription() {
  // const offers = offers
  console.log(offers);


  return (
    <Container>
      <section className="mt-28 home-description">
        <div className="home-description-text">
          <div className="home-description-text-container flex flex-col gap-40">
            <h1 className="font-rfSemibold">
              Станьте<br />
              <div>
                <span className="font-rfBlack gradient-color">супергероем продаж</span>
              </div>
              на маркетплейсах!
            </h1>
            <div><p>Добро пожаловать в мир, где продавцы на маркетплейсах</p>
              <p>не просто работают, а достигают невероятных высот! </p>
              <p>Мы - ваш личный помощник, который всегда на связи</p>
              <p>и готов прийти на помощь. Забудьте о скучных отчетах</p>
              <p>и бесконечных расчетах - у нас есть все, чтобы вы</p>
              <p>сосредоточились на продажах и наслаждались успехом!</p>  </div>
          </div>

          <p></p>
        </div>
        <div className="home-description-image">
          <img src={hero_image} alt="" />
        </div>
      </section>
      <section className="mt-48 home-offer flex flex-col mb-40 ">
        <h1 className="mx-auto home-offer-title font-rfRegular">Что мы <span className="gradient-color font-rfBlack ">ПРЕДЛАГАЕМ?</span></h1>
        <div className="flex flex-col home-offer-list mt-32 gap-24">
          {
            offers?.map((item) => (
              <div className="home-offer-list-item flex flex-col">
                <div className="home-offer-list-item-bg-blur"></div>
                <div className="home-offer-list-item-overlay">
                  <div className="home-offer-list-item-content">
                    <ul className="home-offer-list-item-content-title ">
                      <li className="font-rfBlack">{item.title}:</li>
                    </ul>
                    <p className="home-offer-list-item-content-text manrope-bold  ">{item.text}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </section>
      <section className="flex home-benefits flex-col">
        <h1 className="mx-auto home-benefits-title font-rfSemibold">
          <span className="gradient-color uppercase font-rfBlack">Больше </span>
          времени на продажи,<br />
          <span className="gradient-color uppercase font-rfBlack">меньше </span>
          головной боли с логистикой!</h1>
        <div className=" flex items-center justify-center">
          <img src={illustration_1} alt="" className="home-benefits-img mx-auto  bg-white" />
        </div>
      </section>
      <section className="flex home-benefits flex-col">
        <h1 className="mx-auto home-benefits-title font-rfSemibold">
          <span className="gradient-color uppercase font-rfBlack">Присоединяйтесь </span>   к нам и узнайте,
          как <span className="gradient-color uppercase font-rfBlack">легко</span> и <span className="gradient-color uppercase font-rfBlack">весело</span>  можно продавать
          на маркетплейсах.
        </h1>
        <div className=" flex items-center justify-center">
          <img src={illustration_2} alt="" className="home-benefits-img mx-auto  bg-white" />
        </div>

        <h1 className="mx-auto home-benefits-title font-rfSemibold">
          Мы сделаем вашу
          <span className="gradient-color uppercase font-rfBlack"> жизнь проще, </span>
          <br />
          а ваши
          <span className="gradient-color uppercase font-rfBlack"> продажи — выше! </span>
        </h1>
        <div className="flex items-center justify-center">
          <button className="try-btn font-rfBold">Попробовать бесплатно</button>
        </div>
      </section>
    </Container>

  );
}
