// components/common/DeleteConfirmationModal.js
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiTrash2 } from "react-icons/fi";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="text-center">
                  <div className="text-red-500 flex justify-center mb-4 text-3xl">
                    <FiTrash2 />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                    Do you really want to delete these records? You can't view this in your list anymore if you delete!
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={onClose}
                  >
                    No, Keep It
                  </button>
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={onConfirm}
                  >
                    Yes, Delete It
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteConfirmationModal;
