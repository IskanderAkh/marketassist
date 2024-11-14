import React from 'react'
import Container from "@/components/ui/Container";
import illustration_3 from "@/assets/images/illustration_3.svg";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { faq } from '@/lib/faq';
const FAQ = () => {
    return (
        <Container>
            <section className='faq flex flex-col'>
                <h1 className='faq-title mx-auto font-rfSemibold'>
                    Часто задаваемые <span className='uppercase font-rfBlack faq-title-gradient'>вопросы</span>
                </h1>

                <img src={illustration_3} alt="" className='w-8/12 mx-auto' />

                <div className='flex flex-col gap-10'>
                    <Accordion type="multiple" collapsible className='faq-collapse'>
                        <AccordionItem value="item-1" className='faq-collapse-content'>
                            <AccordionTrigger><h2 className='font-rfSemibold faq-collapse-title z-10'>Как рассчитать чистую прибыль?</h2></AccordionTrigger>
                            <AccordionContent className="z-10 ">
                                <p className='faq-collapse-content-text manrope-medium'>
                                    Наша система сама в этом поможет, просто загрузите данные
                                    о себестоимосьти - и вуаля!
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    {
                        faq.map((item, index) => (
                            <Accordion type="multiple" collapsible className='faq-collapse'>
                                <AccordionItem value="item-1" className='faq-collapse-content'>
                                    <AccordionTrigger><h2 className='font-rfSemibold faq-collapse-title z-10'>{item.question}</h2></AccordionTrigger>
                                    <AccordionContent className="z-10 ">
                                        <p className='faq-collapse-content-text manrope-medium'>
                                            {item.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))
                    }
                </div>
            </section>
        </Container>
    )
}

export default FAQ;
