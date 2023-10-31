import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Layout from "../models/layout.model";
import cloudinary from "cloudinary";

// create layout
export const createLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    const isTypeExists = await Layout.findOne({ type });

    if (isTypeExists)
      return next(new ErrorHandler("Layout already exists", 400));

    if (type === "Banner") {
      const { image, title, subTitle } = req.body;

      if (!image)
        return next(new ErrorHandler("Please provide banner image", 400));

      const cloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });

      const banner = {
        type: "Banner",
        banner: {
          image: {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          },
          title,
          subTitle,
        },
      };

      await Layout.create(banner);
    } else if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );
      await Layout.create({ type: "FAQ", faq: faqItems });
    } else if (type === "Categories") {
      const { categories } = req.body;
      const categoryItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        })
      );
      await Layout.create({ type: "Categories", categories: categoryItems });
    } else {
      return next(new ErrorHandler("Layout not found", 404));
    }

    res.status(201).json({
      success: true,
      message: "Layout created successfully",
    });
  }
);

// edit layout
export const editLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;

    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const bannerData = await Layout.findOne({ type: "Banner" });

      if (!bannerData) {
        return next(new ErrorHandler("Banner not found", 404));
      }

      let public_id = "",
        url = "";

      if (!image.startsWith("https")) {
        // delete old image
        await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);

        const cloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        public_id = cloud.public_id;
        url = cloud.secure_url;
      } else {
        public_id = bannerData?.banner.image.public_id;
        url = bannerData?.banner.image.url;
      }

      const banner = {
        type: "Banner",
        image: {
          public_id,
          url,
        },
        title,
        subTitle,
      };

      await Layout.findByIdAndUpdate(bannerData?._id, { banner });
    } else if (type === "FAQ") {
      const { faq } = req.body;

      const faqData = await Layout.findOne({ type: "FAQ" });

      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );
      await Layout.findByIdAndUpdate(faqData?._id, {
        type: "FAQ",
        faq: faqItems,
      });
    } else if (type === "Categories") {
      const { categories } = req.body;

      const categoriesData = await Layout.findOne({ type: "Categories" });

      const categoryItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        })
      );
      await Layout.findByIdAndUpdate(categoriesData?._id, {
        type: "Categories",
        categories: categoryItems,
      });
    } else {
      return next(new ErrorHandler("Layout not found", 404));
    }

    res.status(201).json({
      success: true,
      message: "Layout updated successfully",
    });
  }
);

// get layout by type
export const getLayoutByType = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const layout = await Layout.findOne({ type: req.params.type });

    res.status(200).json({
      success: true,
      layout,
    });
  }
);
