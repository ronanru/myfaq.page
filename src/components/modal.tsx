import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog onClose={onClose} open={isOpen} className="relative z-50">
      <Transition.Child
        as={Fragment}
        enter="transition"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <div className="fixed inset-0 bg-black bg-opacity-50" />
      </Transition.Child>
      <div className="fixed inset-0 grid place-items-center bg-black bg-opacity-50 p-4">
        <Transition.Child
          as={Fragment}
          enter="transition"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <Dialog.Panel className="w-full max-w-md space-y-4 rounded-2xl bg-white p-4 shadow">
            {title && <Dialog.Title className="text-lg font-bold text-black">{title}</Dialog.Title>}
            {children}
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);

export default Modal;
