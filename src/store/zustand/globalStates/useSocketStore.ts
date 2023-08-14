import { create } from "zustand";

const notis = [
  {
    id: 1,
    subject: "Subject 1",
    content:
      '<p><strong>Subject Line:</strong> New <a href="http://localhost:3000/config/undefined" target="_self">gghg</a></p>\n<p><strong>Body:</strong></p>\n<p><strong>Hello world</strong></p>',
    is_read: false,
    dp: "",
  },
  {
    id: 2,
    subject: "Subject 2",
    content:
      '<p><strong>Subject Line:</strong> New <a href="http://localhost:3000/config/undefined" target="_self">gghg</a></p>\n<p><strong>Body:</strong></p>\n<p><strong>Hello world</strong></p>',
    is_read: false,
    dp: "",
  },
  {
    id: 3,
    subject: "Subject 3",
    content:
      '<p><strong>Subject Line:</strong> New <a href="http://localhost:3000/config/undefined" target="_self">gghg</a></p>\n<p><strong>Body:</strong></p>\n<p><strong>Hello world</strong></p>',
    is_read: false,
    dp: "",
  },
  {
    id: 4,
    subject: "Subject 4",
    content: "content 4",
    is_read: false,
    dp: "",
  },
  {
    id: 5,
    subject: "Subject 5",
    content: "content 5",
    is_read: false,
    dp: "",
  },
  {
    id: 6,
    subject: "Subject 6",
    content: "content 6",
    is_read: false,
    dp: "",
  },
  {
    id: 7,
    subject: "Subject 7",
    content: "content 7",
    is_read: false,
    dp: "",
  },
  {
    id: 8,
    subject: "Subject 8",
    content: "content 8",
    is_read: false,
    dp: "",
  },
];

const useSocketStore = create<{
  messages: any[];
  count: number;
  setMessages: (arg: any) => void;
  setCount: (arg: any) => void;
}>((set) => ({
  messages: [],
  setMessages: (messages: any) => set((state: any) => ({ messages })),
  count: 0,
  setCount: (num: number) => set(() => ({ count: num })),
}));

export default useSocketStore;
