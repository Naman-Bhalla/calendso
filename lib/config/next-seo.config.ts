import { DefaultSeoProps } from "next-seo";

import { HeadSeoProps } from "@components/seo/head-seo";

const seoImages = {
  default: "https://pbs.twimg.com/profile_images/1409449176778231809/DL6cvDfQ_400x400.jpg",
  ogImage: "https://og-image-one-pi.vercel.app/",
};

export const getSeoImage = (key: keyof typeof seoImages): string => {
  return seoImages[key];
};

export const seoConfig: {
  headSeo: Required<Pick<HeadSeoProps, "siteName">>;
  defaultNextSeo: DefaultSeoProps;
} = {
  headSeo: {
    siteName: "Cal.com",
  },
  defaultNextSeo: {
    twitter: {
      handle: "@calendso",
      site: "@Calendso",
      cardType: "summary_large_image",
    },
  },
} as const;
