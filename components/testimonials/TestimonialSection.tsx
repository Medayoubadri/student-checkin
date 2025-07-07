import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee";
import Image from "next/image";
import { AnimatedComponent } from "@/lib/framer-animations";
import SectionBadge from "../ui/section-badge";
import { TextAnimate } from "../magicui/text-animate";
import { ProgressiveBlur } from "../ui/progressive-blur";

// This is a mock data array containing user reviews for the attendance system
const reviews = [
  {
    name: "Professor X",
    username: "@profx",
    body: "This check-in system is a game-changer! It's like having a superpower for attendance tracking—no more chaotic roll calls.",
    img: "https://avatars.githubusercontent.com/u/16860528",
  },
  {
    name: "Ms. Wonder",
    username: "@mswonder",
    body: "I used to dread taking attendance, but now it's a breeze. The real-time metrics make me feel like I have a secret weapon in the classroom!",
    img: "https://avatars.githubusercontent.com/u/20110627",
  },
  {
    name: "Dr. Chill",
    username: "@drchill",
    body: "Who knew checking in students could be this fun? This system keeps my class in line and my stress levels low. Totally worth it!",
    img: "https://avatars.githubusercontent.com/u/106103625",
  },
  {
    name: "Captain Prompt",
    username: "@captnprompt",
    body: "From seamless authentication to real-time reports, this system has it all. My classroom runs like clockwork now—absolutely stellar!",
    img: "https://avatars.githubusercontent.com/u/59228569",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

// This component is responsible for rendering individual review cards
// It displays the reviewer's image, name, username, and review body
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 overflow-hidden rounded-xl border p-5 bg-background/60 backdrop-blur-3xl hover:bg-background/70"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="font-medium dark:text-white text-sm">
            {name}
          </figcaption>
          <p className="font-medium dark:text-white/40 text-xs">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

// This component is responsible for rendering the testimonials section
// It displays user reviews in a marquee format with animations
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-12 md:py-24 lg:py-32 w-full">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="flex flex-col justify-center items-center space-y-4 mb-20 text-center">
          <AnimatedComponent animation="fadeIn" delay={0}>
            <SectionBadge className="bg-primary/20 mb-5 px-4">
              <span className="text-xs">Testimonials</span>
            </SectionBadge>
          </AnimatedComponent>
          <div className="space-y-2">
            <TextAnimate
              animation="blurIn"
              once
              by="word"
              delay={0.3}
              duration={1}
              as="h2"
              segmentClassName="inline-block"
              className="mt-2 font-bold text-zinc-900 dark:text-slate-100 text-3xl sm:text-5xl text-clip tracking-tight"
            >
              What Users Say
            </TextAnimate>

            <AnimatedComponent animation="slideDown" delay={0.3}>
              <p className="mt-6 text-muted-foreground text-lg">
                Hear from educators who have transformed their attendance
                process.
              </p>
            </AnimatedComponent>
          </div>
        </div>
        <AnimatedComponent animation="blurIn" delay={0.5}>
          <div className="relative flex flex-col justify-center items-center w-full overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-background w-1/4 pointer-events-none"></div>
            <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-background w-1/4 pointer-events-none"></div>
            <ProgressiveBlur
              className="top-0 left-0 absolute w-[300px] h-full pointer-events-none"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="top-0 right-0 absolute w-[300px] h-full pointer-events-none"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </AnimatedComponent>
      </div>
    </section>
  );
}
