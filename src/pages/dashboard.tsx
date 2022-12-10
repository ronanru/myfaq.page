import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '@/utils/trpc';
import Loading from '@/components/loading';
import AuthGuard from '@/components/authGuard';
import Select from '@/components/select';
import Toggle from '@/components/toggle';
import { classes, themeNames } from '@/utils/themes';
import Modal from '@/components/modal';
import Input from '@/components/input';
import {
  PencilIcon,
  Square2StackIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  Bars2Icon,
  TrashIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  LinkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCallback, useId, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { signOut } from 'next-auth/react';
import Question from '@/components/question';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@/server/trpc/router';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import History from '@tiptap/extension-history';
import Code from '@tiptap/extension-code';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';

const Dashboard: NextPage = () => {
    const settings = trpc.user.getSettings.useQuery(),
      questions = trpc.question.getAll.useQuery();
    return (
      <AuthGuard center={!settings.data || !settings.data.username}>
        <Head>
          <title>Dashboard | My FAQ Page</title>
          <meta name="og:title" content="Dashboard | My FAQ Page" />
          <meta name="description" content="Set up your own FAQ page" />
          <meta name="og:description" content="Set up your own FAQ page" />
          <link rel="canonical" href="https://myfaq.page/dashboard" />
        </Head>
        {settings.isLoading || questions.isLoading ? (
          <Loading></Loading>
        ) : settings.isError || questions.isError ? (
          <p>Error: {settings.isError ? settings.error.message : questions.error?.message}</p>
        ) : settings.data && questions.data ? (
          settings.data.username ? (
            <>
              <UsernameSettings
                username={settings.data.username}
                onUsernameUpdate={() => settings.refetch()}></UsernameSettings>
              <AccountSettings
                name={settings.data.name}
                image={settings.data.image}
                onAccountUpdate={() => settings.refetch()}></AccountSettings>
              <PageSettings
                isBoxed={settings.data.isBoxed}
                isNumbered={settings.data.isNumbered}
                theme={settings.data.theme}
                onSettingsUpdate={() => settings.refetch()}></PageSettings>
              <QuestionSettings
                questions={questions.data}
                onQuestionsUpdate={() => questions.refetch()}></QuestionSettings>
            </>
          ) : (
            <SetUsernamePage onUsernameChange={() => settings.refetch()}></SetUsernamePage>
          )
        ) : null}
      </AuthGuard>
    );
  },
  UsernameSettings: React.FC<{ username: string; onUsernameUpdate: () => unknown }> = ({
    username,
    onUsernameUpdate
  }) => {
    const [isCheckIcon, setCheckIcon] = useState(false),
      [isEditMode, setIsEditMode] = useState(false),
      setUsername = trpc.user.setUsername.useMutation({
        onSettled: () => {
          setIsEditMode(false);
          onUsernameUpdate();
        }
      });
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Your page</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            const newUsername = new FormData(e.target as HTMLFormElement).get('username') as string;
            if (setUsername.isLoading || newUsername === username) return;
            setUsername.mutate(newUsername);
          }}
          className="flex h-14 items-center justify-between rounded-2xl border-2 border-neutral-200 bg-neutral-100 py-2 pr-2 pl-4">
          <span className="text-lg">
            myfaq.page/
            {isEditMode ? (
              <input
                type="text"
                className="bg-transparent font-semibold outline-none"
                minLength={4}
                maxLength={16}
                name="username"
                autoFocus
                required
                onInput={e =>
                  ((e.target as HTMLInputElement).value = (
                    e.target as HTMLInputElement
                  ).value.replace(/[^a-z0-9_]/g, ''))
                }
                pattern="[a-z0-9_]{4,16}"
                defaultValue={username}
              />
            ) : (
              <span className="font-semibold outline-none">{username}</span>
            )}
          </span>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <button type="button" onClick={() => setIsEditMode(false)}>
                  Cancel
                </button>
                <button className="btn py-1" disabled={setUsername.isLoading}>
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  title="Edit Link"
                  onClick={() => setIsEditMode(true)}
                  className="rounded-lg border border-neutral-400 p-1 hover:border-neutral-500">
                  <PencilIcon className="h-6 w-6"></PencilIcon>
                </button>
                <button
                  type="button"
                  title="Copy Link"
                  className={`rounded-lg border p-1 ${
                    isCheckIcon
                      ? 'border-green-600 text-green-600'
                      : 'border-neutral-400 hover:border-neutral-500'
                  }`}
                  onClick={() => {
                    if (isCheckIcon) return;
                    navigator.clipboard.writeText(`https://myfaq.page/${username}`);
                    setCheckIcon(true);
                    setTimeout(() => setCheckIcon(false), 1000);
                  }}>
                  {isCheckIcon ? (
                    <CheckIcon className="h-6 w-6"></CheckIcon>
                  ) : (
                    <Square2StackIcon className="h-6 w-6"></Square2StackIcon>
                  )}
                </button>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in a New Tab"
                  className="rounded-lg border border-neutral-400 p-1 hover:border-neutral-500"
                  href={`/${username}`}>
                  <ArrowTopRightOnSquareIcon className="h-6 w-6"></ArrowTopRightOnSquareIcon>
                </a>
              </>
            )}
          </div>
        </form>
        <p>Feel free to change the capitalization of the link, it will still work</p>
      </section>
    );
  },
  AccountSettings: React.FC<{
    image: string | null;
    name: string | null;
    onAccountUpdate: () => unknown;
  }> = ({ image, name, onAccountUpdate }) => {
    const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false),
      updateName = trpc.user.setName.useMutation({
        onSettled: () => {
          setIsChangeNameModalOpen(false);
          onAccountUpdate();
        }
      });
    return (
      <>
        <Modal
          title="Change your name"
          isOpen={isChangeNameModalOpen}
          onClose={() => setIsChangeNameModalOpen(false)}>
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              if (updateName.isLoading) return;
              updateName.mutate(new FormData(e.target as HTMLFormElement).get('name') as string);
            }}>
            <Input
              label="New Name"
              minLength={3}
              maxLength={32}
              name="name"
              defaultValue={name || ''}
            />
            <div className="flex items-center justify-end gap-4">
              <button
                className="underline"
                type="button"
                onClick={() => setIsChangeNameModalOpen(false)}>
                Cancel
              </button>
              <button disabled={updateName.isLoading} className="btn">
                Save
              </button>
            </div>
          </form>
        </Modal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Your account</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                className="overflow-hidden rounded-full bg-neutral-200"
                alt="Your Avatar"
                src={image || ''}
                width={75}
                height={75}></Image>
              <p className="flex items-center gap-1 text-2xl text-black">
                {name}
                <button
                  className="rounded-full"
                  title="Edit Name"
                  onClick={() => setIsChangeNameModalOpen(true)}>
                  <PencilIcon className="h-5 w-5"></PencilIcon>
                </button>
              </p>
            </div>
            <button className="btn" onClick={() => signOut({ callbackUrl: '/' })}>
              <ArrowRightOnRectangleIcon className="h-6 w-6"></ArrowRightOnRectangleIcon>
              Sign Out
            </button>
          </div>
        </section>
      </>
    );
  },
  PageSettings: React.FC<{
    isBoxed: boolean;
    isNumbered: boolean;
    theme: number;
    onSettingsUpdate?: () => void;
  }> = props => {
    const setSettings = trpc.user.setSettings.useMutation({ onSettled: props.onSettingsUpdate }),
      [isBoxed, setIsBoxed] = useState(props.isBoxed),
      [isNumbered, setIsNumbered] = useState(props.isNumbered),
      [theme, setTheme] = useState(props.theme);
    return (
      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          if (setSettings.isLoading) return;
          setSettings.mutate({
            isBoxed,
            isNumbered,
            theme
          });
        }}>
        <h2 className="text-2xl font-bold text-black">Page theme settings</h2>
        <Select
          label="Type"
          items={[
            { name: 'Boxes', value: 'boxes' },
            { name: 'Text', value: 'text' }
          ]}
          value={isBoxed ? { name: 'Boxes', value: 'boxes' } : { name: 'Text', value: 'text' }}
          onChange={({ value }) => setIsBoxed(value === 'boxes')}></Select>
        <Select
          label="Theme"
          value={{ value: theme, name: themeNames[theme] as string }}
          items={themeNames.map((name, i) => ({
            name,
            value: i
          }))}
          onChange={({ value }) => setTheme(value as number)}></Select>
        <Toggle checked={isNumbered} label="Numbered Questions" onChange={setIsNumbered}></Toggle>
        <div
          className={`space-y-4 rounded-2xl ${classes[theme]}${
            classes[theme] === 'bg-white' || ' p-4'
          }`}>
          <Question
            answer={{
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ text: 'Hello I am a test answer!', type: 'text' }]
                }
              ]
            }}
            text={`${isNumbered ? `1. ` : ''}Question preview`}
            open={true}
            isBoxed={isBoxed}
            theme={theme}></Question>
        </div>
        <button className="btn mx-auto block min-w-[10rem]">Save</button>
      </form>
    );
  },
  QuestionSettings: React.FC<{
    questions: inferProcedureOutput<AppRouter['question']['getAll']>;
    onQuestionsUpdate: () => void;
  }> = ({ questions, onQuestionsUpdate }) => {
    const addQuestion = trpc.question.add.useMutation({
        onSettled: onQuestionsUpdate
      }),
      setQuestionIndex = trpc.question.setIndex.useMutation({
        onSettled: onQuestionsUpdate
      }),
      sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates
        })
      ),
      [activeQuestionId, setActiveQuestionId] = useState<string | null>(null),
      [operation, setOperation] = useState<'delete' | 'update' | null>(null);
    return (
      <>
        {activeQuestionId && (
          <>
            <DeleteQuestionModal
              isOpen={operation === 'delete'}
              onCancel={() => setOperation(null)}
              onDelete={() => {
                setOperation(null);
                onQuestionsUpdate();
              }}
              questionId={activeQuestionId}
              questionText={
                questions.find(({ id }) => id === activeQuestionId)?.text || ''
              }></DeleteQuestionModal>
            <UpdateQuestionModal
              isOpen={operation === 'update'}
              onCancel={() => setOperation(null)}
              onUpdate={() => {
                setOperation(null);
                onQuestionsUpdate();
              }}
              questionId={activeQuestionId}
              questionText={
                questions.find(({ id }) => id === activeQuestionId)?.text || ''
              }></UpdateQuestionModal>
          </>
        )}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Questions</h2>
            {questions.length < 50 && (
              <button
                className="btn"
                disabled={addQuestion.isLoading}
                onClick={() => addQuestion.mutate()}>
                <PlusIcon className="h-6 w-6"></PlusIcon>
                Add new
              </button>
            )}
          </div>
          <div className="space-y-4">
            <DndContext
              modifiers={[restrictToParentElement]}
              sensors={sensors}
              onDragEnd={({ over, active }) => {
                if (!over) return;
                const oldIndex = questions.find(({ id }) => id === active.id)?.index,
                  newIndex = questions.find(({ id }) => id === over.id)?.index;
                if (oldIndex === undefined || newIndex === undefined || newIndex === oldIndex)
                  return;
                setQuestionIndex.mutate({ newIndex, id: active.id as string });
              }}
              collisionDetection={closestCenter}>
              <SortableContext strategy={verticalListSortingStrategy} items={questions}>
                {questions.map(q => (
                  <QuestionSetting
                    onDelete={() => {
                      setActiveQuestionId(q.id);
                      setOperation('delete');
                    }}
                    onUpdate={() => {
                      setActiveQuestionId(q.id);
                      setOperation('update');
                    }}
                    key={q.id}
                    {...q}></QuestionSetting>
                ))}
              </SortableContext>
            </DndContext>
            {!questions.length && <p className="text-center">No questions found</p>}
          </div>
        </section>
      </>
    );
  },
  QuestionSetting: React.FC<{
    id: string;
    text: string;
    onDelete: () => void;
    onUpdate: () => void;
  }> = ({ id, text, onDelete, onUpdate }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    return (
      <div
        className="flex items-center justify-between rounded-2xl border-2 border-neutral-200 bg-neutral-100 py-2 pr-2 pl-4"
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition
        }}>
        <span className="text-lg">{text}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete()}
            title="Delete Question"
            className="rounded-lg border border-neutral-400 p-1 hover:border-neutral-500">
            <TrashIcon className="h-6 w-6"></TrashIcon>
          </button>
          <button
            onClick={() => onUpdate()}
            title="Edit Question"
            className="rounded-lg border border-neutral-400 p-1 hover:border-neutral-500">
            <PencilIcon className="h-6 w-6"></PencilIcon>
          </button>
          <button
            title="Move Question"
            className="cursor-grab rounded-lg p-1 active:cursor-grabbing"
            {...attributes}
            {...listeners}>
            <Bars2Icon className="h-6 w-6"></Bars2Icon>
          </button>
        </div>
      </div>
    );
  },
  DeleteQuestionModal: React.FC<{
    isOpen: boolean;
    questionText: string;
    questionId: string;
    onCancel: () => void;
    onDelete: () => void;
  }> = ({ isOpen, questionText, questionId, onCancel, onDelete }) => {
    const deleteQuestion = trpc.question.delete.useMutation({
      onSettled: onDelete
    });
    return (
      <Modal
        isOpen={isOpen}
        onClose={onCancel}
        title={`Do you want to delete this question: "${questionText}"?`}>
        <div className="flex items-center justify-end gap-4">
          <button className="underline" type="button" onClick={onCancel}>
            No
          </button>
          <button
            className="btn"
            disabled={deleteQuestion.isLoading}
            onClick={() => deleteQuestion.mutate(questionId)}>
            Yes
          </button>
        </div>
      </Modal>
    );
  },
  UpdateQuestionModal: React.FC<{
    isOpen: boolean;
    questionText: string;
    questionId: string;
    onCancel: () => void;
    onUpdate: () => void;
  }> = ({ isOpen, onCancel, questionId, questionText, onUpdate }) => {
    const question = trpc.question.get.useQuery(questionId),
      updateQuestion = trpc.question.update.useMutation({
        onSettled: onUpdate
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let answer: any | null = null;

    return (
      <Modal isOpen={isOpen} onClose={onCancel} title={`Editing: ${questionText}`}>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            const text = new FormData(e.target as HTMLFormElement).get('text') as string | null;
            if (!text || updateQuestion.isLoading) return;
            updateQuestion.mutate({
              answer: answer || question.data?.answer,
              text,
              id: questionId
            });
          }}>
          {question.isLoading ? (
            <Loading></Loading>
          ) : question.isError ? (
            <p>Error: {question.error.message}</p>
          ) : question.data ? (
            <>
              <Input
                label="Question"
                minLength={3}
                maxLength={100}
                name="text"
                defaultValue={question.data.text}
              />
              <Editor
                label="Answer"
                defaultValue={question.data.answer}
                onUpdate={a => (answer = a)}></Editor>
            </>
          ) : null}
          <div className="flex items-center justify-end gap-4">
            <button className="underline" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn" disabled={updateQuestion.isLoading}>
              Save
            </button>
          </div>
        </form>
      </Modal>
    );
  },
  Editor: React.FC<{
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: any;
    onUpdate?: (value: JSONContent) => void;
  }> = ({ label, defaultValue, onUpdate }) => {
    const id = useId(),
      editor = useEditor({
        extensions: [
          Document,
          Paragraph,
          Text,
          Underline,
          Strike,
          Link.configure({
            openOnClick: false
          }),
          History,
          Code,
          Bold,
          Italic
        ],
        content: defaultValue
      }),
      setLink = useCallback(() => {
        if (!editor) return;
        const url = prompt('URL', editor.getAttributes('link').href);
        if (url === null) return;
        if (url === '') return editor.chain().focus().extendMarkRange('link').unsetLink().run();
        if (url.startsWith('https://') || url.startsWith('http://'))
          return editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        alert('Links should start with https:// or http://');
      }, [editor]);
    if (!editor) return null;
    return (
      <div>
        <label htmlFor={id} className="mb-2 block">
          {label}
        </label>
        <div className="focus-outline group rounded-lg bg-neutral-200 focus-within:outline">
          <div className="flex items-center border-b border-neutral-500">
            <button
              type="button"
              title="Toggle Bold"
              className={`flex h-7 w-7 items-center justify-center rounded-tl-lg font-bold${
                editor.isActive('bold') ? ' bg-neutral-300' : ''
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}>
              B
            </button>
            <button
              title="Toggle Italic"
              type="button"
              className={`flex h-7 w-7 items-center justify-center italic${
                editor.isActive('italic') ? ' bg-neutral-300' : ''
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}>
              I
            </button>
            <button
              title="Toggle Underline"
              type="button"
              className={`flex h-7 w-7 items-center justify-center underline${
                editor.isActive('underline') ? ' bg-neutral-300' : ''
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}>
              U
            </button>
            <button
              title="Toggle Strike"
              type="button"
              className={`flex h-7 w-7 items-center justify-center line-through${
                editor.isActive('strike') ? ' bg-neutral-300' : ''
              }`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}>
              S
            </button>
            <button
              title="Toggle Code"
              type="button"
              className={`flex h-7 w-7 items-center justify-center${
                editor.isActive('code') ? ' bg-neutral-300' : ''
              }`}
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}>
              <CodeBracketIcon className="h-5 w-5"></CodeBracketIcon>
            </button>
            <button
              title="Toggle Link"
              onClick={setLink}
              type="button"
              className={`flex h-7 w-7 items-center justify-center${
                editor.isActive('link') ? ' bg-neutral-300' : ''
              }`}>
              <LinkIcon className="h-5 w-5"></LinkIcon>
            </button>
          </div>
          <EditorContent
            onInput={() => editor && onUpdate?.(editor.getJSON())}
            className="p-2"
            id={id}
            editor={editor}
            required></EditorContent>
        </div>
      </div>
    );
  },
  SetUsernamePage: React.FC<{ onUsernameChange?: () => void }> = ({ onUsernameChange }) => {
    const setUsername = trpc.user.setUsername.useMutation({ onSettled: onUsernameChange });
    return (
      <>
        <h1 className="text-center text-4xl font-bold text-black">Claim your page!</h1>
        <form
          className="flex flex-col gap-2 md:flex-row"
          onSubmit={e => {
            e.preventDefault();
            if (setUsername.isLoading) return;
            setUsername.mutate(new FormData(e.target as HTMLFormElement).get('username') as string);
          }}>
          <div className="rounded-2xl border-2 border-neutral-200 bg-neutral-100 p-4">
            myfaq.page/
            <input
              type="text"
              pattern="[a-z0-9_]{4,16}"
              minLength={4}
              required
              name="username"
              maxLength={16}
              onInput={e =>
                ((e.target as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value.replace(/[^a-z0-9_]/g, ''))
              }
              className="bg-transparent font-semibold outline-none"
            />
          </div>
          <button className="btn">
            Continue <ArrowRightIcon className="h-6 w-6"></ArrowRightIcon>
          </button>
        </form>
      </>
    );
  };

export default Dashboard;
