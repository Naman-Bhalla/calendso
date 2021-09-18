import Avatar from "@components/ui/Avatar";
import { HeadSeo } from "@components/seo/head-seo";
import useTheme from "@lib/hooks/useTheme";
import { ArrowRightIcon } from "@heroicons/react/outline";
import prisma from "@lib/prisma";
import { inferSSRProps } from "@lib/types/inferSSRProps";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";
import EventTypeDescription from "@components/eventtype/EventTypeDescription";

export default function User(props: inferSSRProps<typeof getServerSideProps>) {
  const { isReady } = useTheme(props.user.theme);

  return (
    <>
      <HeadSeo
        title={props.user.name || props.user.username}
        description={props.user.name || props.user.username}
        name={props.user.name || props.user.username}
        avatar={props.user.avatar}
      />
      {isReady && (
        <div className="bg-neutral-50 dark:bg-black h-screen">
          <main className="max-w-3xl mx-auto py-24 px-4">
            <div className="mb-8 text-center">
              <Avatar
                imageSrc={props.user.avatar}
                displayName={props.user.name}
                className="mx-auto w-24 h-24 rounded-full mb-4"
              />
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                {props.user.name || props.user.username}
              </h1>
              <p className="text-neutral-500 dark:text-white">{props.user.bio}</p>
            </div>
            <div className="space-y-6" data-testid="event-types">
              {props.eventTypes.map((type) => (
                <div
                  key={type.id}
                  className="group relative dark:bg-neutral-900 dark:border-0 dark:hover:border-neutral-600 bg-white hover:bg-gray-50 border border-neutral-200 hover:border-black rounded-sm">
                  <ArrowRightIcon className="absolute transition-opacity h-4 w-4 right-3 top-3 text-black dark:text-white opacity-0 group-hover:opacity-100" />
                  <Link href={`/${props.user.username}/${type.slug}`}>
                    <a className="block px-6 py-4">
                      <h2 className="font-semibold text-neutral-900 dark:text-white">{type.title}</h2>
                      <EventTypeDescription eventType={type} />
                    </a>
                  </Link>
                </div>
              ))}
            </div>
            {props.eventTypes.length == 0 && (
              <div className="shadow overflow-hidden rounded-sm">
                <div className="p-8 text-center text-gray-400 dark:text-white">
                  <h2 className="font-semibold text-3xl text-gray-600 dark:text-white">Uh oh!</h2>
                  <p className="max-w-md mx-auto">This user hasn&apos;t set up any event types yet.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const username = (context.query.user as string).toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      bio: true,
      avatar: true,
      theme: true,
      plan: true,
    },
  });
  if (!user) {
    return {
      notFound: true,
    };
  }

  const eventTypesWithHidden = await prisma.eventType.findMany({
    where: {
      OR: [
        {
          userId: user.id,
        },
        {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      length: true,
      description: true,
      hidden: true,
    },
    take: user.plan === "FREE" ? 1 : undefined,
  });
  const eventTypes = eventTypesWithHidden.filter((evt) => !evt.hidden);
  return {
    props: {
      eventTypes,
      user,
    },
  };
};

// Auxiliary methods
export function getRandomColorCode(): string {
  let color = "#";
  for (let idx = 0; idx < 6; idx++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}
