import { Statistics } from "./Statistics";
import AboutUs from "@/assets/about-us.jpg";

export const About = () => {
  return (
    <section id="about" className="container  sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <div className="relative">
            <img
              src={AboutUs}
              alt="Developers"
              className="md:w-[3000px] flex justify-center h-[300px] object-cover rounded-2xl shadow-lg border-4 border-primary/20"
            />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
          </div>
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                AY CREATIVE TECHNOLOGY
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Born from bold ideas and built by visionaries, our company was
                founded on one belief: technology should not follow trends — it
                should set them. We are a team of engineers, designers, and
                thinkers who craft original software solutions that challenge
                convention, disrupt industries, and shape the future. Every line
                of code we write is driven by innovation, not imitation.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
