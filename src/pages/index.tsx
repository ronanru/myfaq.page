import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/layout';
import Question from '../components/question';
import Select from '../components/select';
import Toggle from '../components/toggle';
import Modal from '@/components/modal';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { themeNames, classes } from '../utils/themes';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

const Home: NextPage = () => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    return (
      <>
        <Head>
          <title>My FAQ Page - Answer all questions with one link</title>
          <meta name="description" content="Create a beautiful FAQ page in under 5 minutes." />
          <meta name="og:description" content="Create a beautiful FAQ page in under 5 minutes." />
          <meta name="og:title" content="My FAQ Page - Answer all questions with one link" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="og:image" content="/og.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <link rel="canonical" href="https://myfaq.page" />
        </Head>
        <Modal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)}>
          <button
            className="flex w-full items-center justify-center gap-4 rounded-lg bg-[#5865F2] p-4 text-white shadow"
            onClick={() => signIn('discord')}>
            <svg className="h-6 w-6" viewBox="0 0 71 55">
              <path
                fill="currentColor"
                d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
              />
            </svg>
            Sign In with Discord
          </button>
          <button
            className="flex w-full items-center justify-center gap-4 rounded-lg bg-[#24292E] p-4 text-white shadow"
            onClick={() => signIn('github')}>
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
            Sign In with GitHub
          </button>
          <button className="mx-auto block underline" onClick={() => setIsSignInModalOpen(false)}>
            Cancel
          </button>
        </Modal>
        <Layout center={false} onSignIn={() => setIsSignInModalOpen(true)}>
          <HeroSection onSignIn={() => setIsSignInModalOpen(true)}></HeroSection>
          <AboutSection></AboutSection>
          <DemoSection></DemoSection>
        </Layout>
      </>
    );
  },
  HeroSection: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
    const session = useSession();
    return (
      <section className="relative w-full py-32 md:flex">
        <div className="flex flex-col justify-center gap-4 bg-white text-center md:w-1/2 md:text-left">
          <h1 className="xl:text-6xl space-y-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="block text-black">Answer all questions</span>
            <span className="block bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              with one link
            </span>
          </h1>
          <p className="text-base text-black sm:text-xl">
            Create a beautiful FAQ page in under 5 minutes.
          </p>
          <div className="flex items-center justify-center gap-4 md:justify-start">
            {session.status === 'authenticated' ? (
              <Link href="/dashboard" className="btn">
                Go to Dashboard
              </Link>
            ) : (
              <button className="btn" onClick={onSignIn}>
                Claim my page
              </button>
            )}
            <a className="rounded-md text-black underline" href="#demo">
              See the demo
            </a>
          </div>
        </div>
        <div className="hidden w-24 bg-gradient-to-r from-white to-transparent md:block"></div>
        <div className="absolute right-0 top-0 bottom-0 -z-10 hidden w-80 flex-col justify-center gap-4 md:flex lg:z-0 lg:w-96">
          <div className="flex items-center justify-between gap-1 rounded-md bg-neutral-200 py-2 px-4 text-center shadow">
            <LockClosedIcon className="h-5 w-5"></LockClosedIcon>
            <div>
              <span className="text-neutral-700">myfaq.page/</span>
              <span className="font-bold text-indigo-800">yourname</span>
            </div>
            <div className="w-5"></div>
          </div>
          <Question
            text="How old are you?"
            isBoxed={true}
            answer={{
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ text: "I'm 22, I was born in December of 1999", type: 'text' }]
                }
              ]
            }}
            open={true}
            theme={0}></Question>
          <Question
            text="Where are you located?"
            isBoxed={true}
            answer={{
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ text: 'I live in London, UK 🇬🇧', type: 'text' }]
                }
              ]
            }}
            open={false}
            theme={0}></Question>
        </div>
      </section>
    );
  },
  AboutSection: React.FC = () => (
    <>
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-black">How it works?</h2>
        <p>
          Are you tired of having to answer the same questions? Get your own
          {' "'}Frequently Asked Questions{'"'} page for free. After you sign up, you can claim your
          link with your username.
        </p>
      </section>
    </>
  ),
  DemoSection: React.FC = () => {
    const questions = [
        {
          text: 'Is it free?',
          answer: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: "Yes, it's 100% free",
                    type: 'text'
                  }
                ]
              }
            ]
          }
        },
        {
          text: 'Who is it for?',
          answer: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: 'Originally it was built for streamers and other content creators, but it can be used by anyone from upcoming creators to established organizations',
                    type: 'text'
                  }
                ]
              }
            ]
          }
        },
        {
          text: 'How do I use it?',
          answer: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: "It's easy! Claim your unique FAQ page with your username, choose the theme, set the questions, and put your new FAQ page to your bio on any social media platforms",
                    type: 'text'
                  }
                ]
              }
            ]
          }
        }
      ],
      [isBoxed, setIsBoxed] = useState(true),
      [isNumbered, setIsNumbered] = useState(false),
      [theme, setTheme] = useState(0);

    return (
      <section className="w-full space-y-4">
        <h2 className="text-3xl font-bold text-black">Live demo</h2>
        <div className="space-y-4 rounded-2xl border-2 border-neutral-500 p-4">
          <h3 className="text-xl font-bold text-black">Options</h3>
          <Select
            label="Type"
            items={[
              { name: 'Boxes', value: 'boxes' },
              { name: 'Text', value: 'text' }
            ]}
            onChange={({ value }) => setIsBoxed(value === 'boxes')}></Select>
          <Select
            label="Theme"
            items={themeNames.map((name, i) => ({
              name,
              value: i
            }))}
            onChange={({ value }) => setTheme(value as number)}></Select>
          <Toggle checked={isNumbered} label="Numbered Questions" onChange={setIsNumbered}></Toggle>
        </div>
        <div
          className={`space-y-4 rounded-2xl ${classes[theme]}${
            classes[theme]?.endsWith('bg-white') || ' p-4'
          }`}>
          {questions.map(({ answer, text }, i) => (
            <Question
              key={i}
              answer={answer}
              text={`${isNumbered ? `${i + 1}. ` : ''}${text}`}
              isBoxed={isBoxed}
              theme={theme}></Question>
          ))}
        </div>
      </section>
    );
  };

export default Home;
