import Table from "../Table";
import styles from "./DataContainer.module.css";

export type DataContainerType = {
  items: any[];
  total: number;
  page: number;
  size: number;
  pages: 1;
  headers: any;
  exclude: any[];
  info: any;
};

const DataContainer = ({
  items,
  info,
  total,
  page,
  pages,
  size,
  headers,
  exclude,
}: DataContainerType) => {
  return (
    <div className={styles.container}>
      <Table headers={headers} items={items} exclude={exclude} />
    </div>
  );
};

export default DataContainer;
