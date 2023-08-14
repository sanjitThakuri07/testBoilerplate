import styles from "./BaseTemplate.module.css";

export type BaseTemplateType = {
  sampleTextProp: string;
};

const BaseTemplate = ({ sampleTextProp }: BaseTemplateType) => {
  return <div className={styles.container}>Content:{sampleTextProp}</div>;
};

export default BaseTemplate;
