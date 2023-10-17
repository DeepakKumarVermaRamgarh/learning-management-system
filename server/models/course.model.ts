import mongoose, { Document, Model } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser;
  comment: string;
  commentReplies?: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  url: string;
  title: string;
}

interface IQuestion extends Document {
  user: IUser;
  question: string;
  questionReplies?: [Object];
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IQuestion[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
  },
  { timestamps: true }
);

const linkSchema = new mongoose.Schema<ILink>(
  {
    title: String,
    url: String,
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema<IComment>(
  {
    user: Object,
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    user: Object,
    question: String,
    questionReplies: [Object],
  },
  { timestamps: true }
);

const courseDataSchema = new mongoose.Schema<ICourseData>(
  {
    title: String,
    description: String,
    videoUrl: String,
    videoThumbnail: Object,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [questionSchema],
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Course: Model<ICourse> = mongoose.model("Course", courseSchema);
export default Course;
