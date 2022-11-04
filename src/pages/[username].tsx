import type { GetStaticPaths, GetStaticPathsContext, InferGetStaticPropsType } from 'next';
import { prisma } from '@/server/db/client';
import { classes } from '@/utils/themes';
import Question from '@/components/question';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export const getStaticProps = async (ctx: GetStaticPathsContext) => {
    const page = await prisma.user.findUnique({
      where: {
        username: (ctx as { params: { username: string } }).params.username.toLowerCase()
      },
      select: {
        image: true,
        isBoxed: true,
        isNumbered: true,
        theme: true,
        name: true,
        username: true,
        questions: {
          select: {
            answer: true,
            text: true
          },
          orderBy: {
            index: 'asc'
          }
        }
      }
    });
    return {
      props: { page },
      notFound: !page
    };
  },
  getStaticPaths: GetStaticPaths = () =>
    Promise.resolve({
      paths: [],
      fallback: 'blocking'
    });

const FAQPage = ({ page }: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!page) return <p>Oops, you aren{"'"}t supposed to see this</p>;
  return (
    <>
      <Head>
        <title>{`${page.name}'s Frequently Asked Questions Page`}</title>
        <meta name="og:title" content={`${page.name}'s Frequently Asked Questions Page`} />
        <meta
          name="description"
          content={`Find answers to questions ${page.name} gets the most often. Powered by My FAQ Page`}
        />
        <meta
          name="og:description"
          content={`Find answers to questions ${page.name} gets the most often. Powered by My FAQ Page`}
        />
        <link rel="canonical" href={`https://myfaq.page/${page.username}`} />
        {page.name && page.image && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="og:image"
              content={`/api/og?theme=${page.theme}&name=${encodeURIComponent(
                page.name
              )}&image=${encodeURIComponent(page.image)}`}
            />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
      </Head>
      <div className={`flex flex-1 flex-col ${classes[page.theme]}`}>
        <header className="container flex items-center gap-2 p-4">
          <Image
            className="rounded-md"
            alt={`${page.name}'s profile picture`}
            src={page.image as string}
            width={50}
            height={50}></Image>
          <h1 className="text-2xl font-bold">{page.name || 'Andy'}</h1>
        </header>
        <main className="container flex-1 space-y-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          {page.questions.map(({ answer, text }, i) => (
            <Question
              key={i}
              answer={answer as Record<string, unknown>}
              text={`${page.isNumbered ? `${i + 1}. ` : ''}${text}`}
              theme={page.theme}
              isBoxed={page.isBoxed}></Question>
          ))}
          {!page.questions.length && <p className="text-center">No questions found</p>}
        </main>
        <footer className="p-4 text-center">
          Powered by{' '}
          <Link href="/" className="underline">
            My FAQ Page
          </Link>
        </footer>
      </div>
    </>
  );
};

export default FAQPage;
