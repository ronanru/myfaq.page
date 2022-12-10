import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { generateHTML } from '@tiptap/html';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { Fragment, useMemo } from 'react';

const Question: React.FC<{
  text: string;
  answer: Record<string, unknown>;
  isBoxed: boolean;
  open?: boolean;
  theme: number;
}> = ({ text, answer, isBoxed, open, theme }) => {
  const answerHtml = useMemo(
    () =>
      generateHTML(answer, [
        Document,
        Text,
        Paragraph,
        Underline,
        Strike,
        Link.configure({
          HTMLAttributes: {
            class: 'underline'
          }
        }),
        Code,
        Bold,
        Italic
      ]),
    [answer]
  );
  return isBoxed ? (
    <Disclosure
      defaultOpen={open}
      as="div"
      className={
        [
          'rounded-2xl border-2 border-neutral-500 bg-neutral-100 p-4 shadow',
          '',
          'rounded-lg bg-neutral-700 p-4',
          'rounded-lg bg-neutral-900 p-4',
          'rounded-2xl bg-red-200 p-4',
          'rounded-2xl border-2 border-orange-300 bg-orange-100 p-4'
        ][theme]
      }>
      <Disclosure.Button className="flex w-full items-center justify-between text-lg font-bold">
        {text}
        <ChevronRightIcon
          aria-hidden="true"
          className="h-5 w-5 transition-transform ui-open:rotate-90 ui-open:transform"
        />
      </Disclosure.Button>
      <Transition
        as={Fragment}
        enter="transition"
        enterFrom="transform scale-y-95 opacity-0"
        enterTo="transform scale-y-100 opacity-100"
        leave="transition"
        leaveFrom="transform scale-y-100 opacity-100"
        leaveTo="transform scale-y-95 opacity-0">
        <Disclosure.Panel
          dangerouslySetInnerHTML={{ __html: answerHtml }}
          className={
            [
              'text-neutral-800',
              'text-neutral-800',
              'text-neutral-200',
              'text-neutral-200',
              'text-red-900',
              'text-yellow-900'
            ][theme]
          }></Disclosure.Panel>
      </Transition>
    </Disclosure>
  ) : (
    <div>
      <p
        className={`text-lg font-bold ${
          ['text-black', 'text-black', 'text-white', 'text-white', 'text-black', 'text-black'][
            theme
          ]
        }`}>
        {text}
      </p>
      <p
        dangerouslySetInnerHTML={{ __html: answerHtml }}
        className={
          [
            'text-neutral-800',
            'text-neutral-800',
            'text-neutral-200',
            'text-neutral-200',
            'text-red-900',
            'text-yellow-900'
          ][theme]
        }></p>
    </div>
  );
};

export default Question;
