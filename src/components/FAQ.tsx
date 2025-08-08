import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question:
      "What makes AY CREATIVE TECHNOLOGY different from other development companies?",
    answer:
      "We don't just follow trends — we set them. Our team of visionaries crafts original software solutions that challenge convention and disrupt industries. Every line of code is driven by innovation, not imitation.",
    value: "item-1",
  },
  {
    question: "What services does AY CREATIVE TECHNOLOGY offer?",
    answer:
      "We offer comprehensive digital solutions including website development, mobile app development, hosting services, digital marketing, and content creation. From AI-powered tools to immersive platforms, we create transformative technology solutions.",
    value: "item-2",
  },
  {
    question: "How long does it typically take to complete a project?",
    answer:
      "Project timelines vary based on complexity and scope. Website development typically takes 2-6 weeks, mobile apps 6-12 weeks, and custom software solutions 3-6 months. We provide detailed timelines during our initial consultation.",
    value: "item-3",
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer:
      "Absolutely! We believe in long-term partnerships. All our projects include comprehensive support, regular updates, security monitoring, and maintenance to ensure your technology continues to perform at its peak.",
    value: "item-4",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-12 sm:py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="mailto:support@aydevelopers.com.ng"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
