// components/InviteDateModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface InviteDateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (startDate: string, dueDate: string) => void;
    employeeName: string;
}

export default function InviteDateModal({
    isOpen,
    onClose,
    onConfirm,
    employeeName,
}: InviteDateModalProps) {
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-30"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-30"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-xl w-full max-w-sm p-6">
                            <Dialog.Title className="text-lg font-semibold mb-4">
                                Assign {employeeName} to learn
                            </Dialog.Title>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 px-3 py-2 border rounded-md"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 px-3 py-2 border rounded-md"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                                        onClick={() => {
                                            if (!startDate || !dueDate) {
                                                alert('Vui lòng chọn ngày');
                                                return;
                                            }
                                            onConfirm(startDate, dueDate);
                                            onClose();
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
