import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Cta = () => {
  return (
    <section id="cta" className="bg-muted/50 py-16 my-24 sm:my-32">
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Ready to Transform
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Your Vision{" "}
            </span>
            Into Reality?
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Join AY CREATIVE TECHNOLOGY and experience innovation that doesn't
            follow trends — it sets them. Let's pioneer your next breakthrough
            together.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Link to="/signup">
            <Button className="w-full md:mr-4 md:w-auto">
              Get Started Today
            </Button>
          </Link>
          <Button variant="outline" className="w-full md:w-auto">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};
