import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';

const useUndoRedo = (initialDatas) => {
  const templateDatasets = useTemplateFieldsStore((state) => state.templateDatasets);
  const currentStateIndex = useTemplateFieldsStore((state) => state.currentStateIndex);
  const pastStates = useTemplateFieldsStore((state) => state.pastStates);
  const setTemplateDatasets = useTemplateFieldsStore((state) => state.setTemplateDatasets);
  const setCurrentStateIndex = useTemplateFieldsStore((state) => state.setCurrentStateIndex);
  const setPastStates = useTemplateFieldsStore((state) => state.setPastStates);

  const undo = () => {
    if (currentStateIndex > -1) {
      const newCurrentStateIndex = currentStateIndex - 1;
      const newState = pastStates[newCurrentStateIndex];
      setCurrentStateIndex(newCurrentStateIndex);
      setTemplateDatasets(newState);
    }
  };

  const redo = () => {
    if (currentStateIndex < pastStates.length - 1) {
      const newCurrentStateIndex = currentStateIndex + 1;
      const newState = pastStates[newCurrentStateIndex];
      setCurrentStateIndex(newCurrentStateIndex);
      setTemplateDatasets(newState);
    }
  };

  const setNewState = (newState) => {
    setTemplateDatasets(newState);
    setCurrentStateIndex(currentStateIndex + 1);
    setPastStates([...pastStates.slice(0, currentStateIndex + 1), newState]);
  };

  return [templateDatasets, setNewState, undo, redo];
};

export default useUndoRedo;
