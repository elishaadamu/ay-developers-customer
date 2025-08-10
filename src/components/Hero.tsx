import { Button } from "./ui/button";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  return (
    <section
      className="container grid lg:grid-cols-2 place-items-center py-14 md:py-12 gap-10"
      id="home"
    >
      <div className="text-center lg:text-start space-y-6">
        <main className="text-4xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              AY CREATIVE
            </span>{" "}
            <span className="dark:text-white">TECHNOLOGY</span>
          </h1>{" "}
          -{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Pioneering
            </span>{" "}
            <span className="dark:text-white">Possibilities</span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          We don't just create software — we pioneer possibilities no one has
          explored before. Technology should not follow trends — it should set
          them.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a rel="noreferrer noopener" href="#about">
            <Button className="w-full md:w-1/2">Get Started</Button>
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
