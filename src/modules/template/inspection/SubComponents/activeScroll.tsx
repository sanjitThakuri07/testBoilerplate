import { validateInput } from "containers/template/validation/inputLogicCheck";
import { KeyOptionsName } from "src/modules/template/components/InputComponents/ResponseInputLogicNew";

export function activeScroll(element: any, state: string = "hide") {
  const blurOtherElement = document.querySelectorAll(`[data-item]`);
  if (state !== "remove") {
    blurOtherElement.forEach((el: any) => {
      el.classList.add("blur__question");
    });
    element.classList.remove("blur__question");
    element.style.scrollMarginTop = "100px";
    element.scrollIntoView({ block: "start", behavior: "smooth" });
    // element.style.border = '1px solid red';
    element.classList.add("focus__question");
  } else {
    blurOtherElement.forEach((element: any) => {
      element.classList.remove("blur__question");
    });
  }
}

export function checkActionTrigger({
  value,
  logic,
  ALL_OPTIONS,
  question,
  templateTitle,
  setFieldValue,
  values,
}: any) {
  // need to check if it is for immediate or
  // if immediate notify
  // if not set in the formik values
  // hit api on inspection completion
  // for now on whole form submit

  let keyName = !question.globalLogicReferenceId
    ? question.logicId
    : question.globalLogicReferenceId?.split("[logicParentId]")?.[0];
  for (let i = 0; i < logic.logics.length; i++) {
    let conditionDataset = {
      condition: logic?.logics?.[`${i}`].condition,
      trigger: logic?.logics?.[`${i}`].trigger,
      value: logic?.logics?.[`${i}`].value,
      linkQuestions: logic?.logics?.[`${i}`]?.linkQuestions || [],
    };

    if (
      validateInput({
        operator: conditionDataset?.condition,
        userInput: value,
        authorizedValues: Array.isArray(conditionDataset?.value)
          ? conditionDataset?.value
          : [conditionDataset?.value],
        allOptions: ALL_OPTIONS,
      })
    ) {
      const indexOfTrigger = conditionDataset?.trigger?.findIndex((tr: any) => {
        return tr?.name === KeyOptionsName?.NOTIFY;
      });
      if (indexOfTrigger != -1) {
        // api request or set value to form
        const triggerValue = conditionDataset?.trigger[indexOfTrigger];
        let updatedValue = value;
        if (question.response_choice !== "default" && Array.isArray(value) && logic?.logicApi) {
          // updatedValue = updatedValue?.map((it: any) => it?.[logic?.logicApi?.field || 'name']);
          updatedValue = updatedValue?.[0]?.[logic?.logicApi?.field || "name"];
        }
        let finalValues = {
          inspection_url: window.location.href,
          question: question.label || "",
          answer: updatedValue,
          form: templateTitle,
          to: [
            ...(triggerValue?.value?.[0]?.inspection_groups || []),
            ...(triggerValue?.value?.[0]?.inspection_users || []),
          ],
          type: triggerValue?.value?.[0]?.inspection_available_type,
          id: question.id,
        };

        setFieldValue("notification", {
          ...(values.notification || {}),
          [keyName]: [finalValues, ...(values?.notification?.[keyName] || [])],
        });
      }
      break;
    } else {
      let prevNotification: any = { ...values?.notification };
      if (!prevNotification?.[`${keyName}`]) return;
      if (prevNotification[question?.logicId]) {
        delete prevNotification?.[question?.logicId];
        setFieldValue("notification", prevNotification);
      } else {
        const updatedNotificationData = prevNotification?.[keyName]?.filter(
          (it: any) => it?.id !== question?.id,
        );
        setFieldValue("notification", {
          ...(values.notification || {}),
          [keyName]: updatedNotificationData,
        });
      }
    }
  }
}
