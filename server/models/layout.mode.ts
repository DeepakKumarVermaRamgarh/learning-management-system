import mongoose, { Schema, Model, Document } from "mongoose";

interface IFaqItem extends Document {
  question: string;
  answer: string;
}

interface ICategory extends Document {
  title: string;
}

interface IBannerImage extends Document {
  public_id: string;
  url: string;
}

interface ILayout extends Document {
  type: string;
  faq: IFaqItem[];
  categories: ICategory[];
  banner: {
    image: IBannerImage;
    title: string;
    subTitle: string;
  };
}

const faqSchema = new Schema<IFaqItem>({
  question: String,
  answer: String,
});

const categorySchema = new Schema<ICategory>({
  title: String,
});

const bannerImgSchema = new Schema<IBannerImage>({
  public_id: String,
  url: String,
});

const layoutSchema = new Schema<ILayout>({
  type: { type: String, required: [true, "Layout type is required"] },
  faq: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImgSchema,
    title: String,
    subTitle: String,
  },
});

const Layout: Model<ILayout> = mongoose.model("Layout", layoutSchema);

export default Layout;
