import Container from "@/components/ui/Container";
import { useEffect } from "react";
import "./HomeDescription.scss";

export default function HomeDescription() {
  useEffect(() => {
    const interBubble = document.querySelector(".interactive");
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(move);
    }

    window.addEventListener("mousemove", (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    });

    move();
  }, []);

  return (
    <section className="">
      <div className="relative h-full w-full">
        <div className="text-container">
          <Container>
            <div className="flex h-full gap-4">
              <div className="flex h-full flex-col justify-evenly">
                <h1 className="z-50">
                  Автоматизация аналитики и <br />
                  отзывов на Wildberries
                </h1>

                <h2 className="w-full max-w-xl">
                  Получите полный контроль над вашими данными на Wildberries.
                  Используйте наши инструменты для автоматического анализа,
                  расчета и создания отчетов, чтобы улучшить свои результаты и
                  достичь новых высот в вашем бизнесе.
                </h2>

                <div className="flex items-center gap-4">
                  <a className="btn btn-primary text-white">
                    Попробовать
                  </a>
                  <a className="btn btn-wide btn-white">
                    Аналитика
                  </a>
                </div>
              </div>
              <div></div>
            </div>
            <div></div>
          </Container>
        </div>
        <div className="gradient-bg grad">
          <div className="gradients-container">
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
            <div className="interactive"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
