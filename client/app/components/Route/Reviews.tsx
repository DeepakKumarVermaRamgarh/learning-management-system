import { styles } from "@/app/styles/style";
import Image from "next/image";
import ReviewCard from "../Review/ReviewCard";
import DefaultImage from "../../../public/assets/avatar.png";

type Props = {};

export const reviews: any[] = [
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Web Developer",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem aperiam, unde eius reiciendis soluta at distinctio minima? Placeat id dolores modi velit dicta eos repellendus. Soluta aliquid est error nostrum iste placeat odio assumenda atque impedit possimus architecto natus eos voluptatibus tempora vitae ullam incidunt voluptas, ipsam, tempore maxime non.",
    ratings: 4.5,
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Web Developer",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem aperiam, unde eius reiciendis soluta at distinctio minima? Placeat id dolores modi velit dicta eos repellendus. Soluta aliquid est error nostrum iste placeat odio assumenda atque impedit possimus architecto natus eos voluptatibus tempora vitae ullam incidunt voluptas, ipsam, tempore maxime non.",
    ratings: 4.5,
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Web Developer",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem aperiam, unde eius reiciendis soluta at distinctio minima? Placeat id dolores modi velit dicta eos repellendus. Soluta aliquid est error nostrum iste placeat odio assumenda atque impedit possimus architecto natus eos voluptatibus tempora vitae ullam incidunt voluptas, ipsam, tempore maxime non.",
    ratings: 4.5,
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Web Developer",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem aperiam, unde eius reiciendis soluta at distinctio minima? Placeat id dolores modi velit dicta eos repellendus. Soluta aliquid est error nostrum iste placeat odio assumenda atque impedit possimus architecto natus eos voluptatibus tempora vitae ullam incidunt voluptas, ipsam, tempore maxime non.",
    ratings: 4.5,
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center mb-5">
        <div className="800px:w-[50%] w-full">
          <Image src={DefaultImage} alt="reviews" width={700} height={700} />
        </div>

        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px] `}>
            Our Students Are{" "}
            <span className={styles.gradient}>Our Strength</span>
            <br />
            See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem
            similique unde reprehenderit doloribus explicabo iusto quam eos
            error, animi ad, voluptatum, pariatur maxime provident. Assumenda
            laudantium laboriosam cumque, voluptatibus corrupti dolorem neque
            sequi distinctio impedit modi hic ducimus quasi inventore alias rem
            nam vero nobis excepturi. Blanditiis nulla reprehenderit ex.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(6)]:!mt-[-40px] ">
        {reviews &&
          reviews.map((review: any, index: number) => (
            <ReviewCard key={index} review={review} />
          ))}
      </div>
    </div>
  );
};

export default Reviews;
