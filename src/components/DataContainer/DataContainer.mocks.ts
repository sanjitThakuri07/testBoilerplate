import { DataContainerType } from "./DataContainer";

const base: DataContainerType = {
  items: [
    {
      id: 1,
      name: "Firoj Siddiki",
      email: "er.firojsiddiki@gmail.com",
      profession: "Software Engineer",
      status: "Active",
      desc: null,
      company: "Brain Tip AI",
      created_at: "2023-08-08T08:49:17.631678+00:00",
      updated_at: "2023-08-08T08:49:17.631678+00:00",
    },
    {
      id: 2,
      name: "Saharoj Siddiki",
      email: "dr.saharoj@gmail.com",
      profession: "Doctor",
      status: "Active",
      desc: null,
      company: "Saharoj Health Clinic",
      created_at: "2023-08-08T08:49:17.631678+00:00",
      updated_at: "2023-08-08T08:49:17.631678+00:00",
    },
  ],
  total: 2,
  page: 1,
  size: 50,
  pages: 1,
  headers: {
    name: "Name",
    email: "Email",
    profession: "Profession",
    company: "Company",
    status: "Status",
    desc: "Description",
    created_by: "Created By",
    created_at: "Created At",
    updated_at: "Last Modified At",
  },
  exclude: ["created_at", "created_by"],
  info: {
    archived_count: 0,
  },
};

export const mockDataContainerProps = {
  base,
};
