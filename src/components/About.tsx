import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";

export const About = () => {
  return (
    <section id="about" className="container py-12 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
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
