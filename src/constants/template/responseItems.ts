import TextAnswerIcon from 'assets/template/icons/Text_answer.png';
import CheckboxIcon from 'assets/template/icons/checkbox.svg';
import DateTime from 'assets/template/icons/dateTime.png';
import InstructionIcon from 'assets/template/icons/instruction.png';
import MediaIcon from 'assets/template/icons/media.png';
import NumberIcon from 'assets/template/icons/number.png';
import SignatureIcon from 'assets/template/icons/signature.png';
import SliderIcon from 'assets/template/icons/slider.png';
import SpeechRecognitionIcon from 'assets/template/icons/speech_recognition.svg';
import TemperatureIcon from 'assets/template/icons/temperature.svg';

export default [
  {
    id: 'TEXT_001',
    label: 'Text Answer',
    type: 'text',
    input_type: 'text',
    value: 'text_answer',
    Icon: TextAnswerIcon,
  },
  // {
  //   id: 'INSPECT_001',
  //   label: 'Inspection Date',
  //   type: 'inspection_date',
  //   input_type: 'date',
  //   value: 'inspection_date',
  //   Icon: InspectionDateIcon,
  // },
  {
    id: 'DATE_001',
    label: 'Date Time',
    type: 'date',
    input_type: 'date',
    value: 'date_time',
    Icon: DateTime,
  },
  // {
  //   id: 'DOC_001',
  //   label: 'Document Number',
  //   value: 'document_number',
  //   type: 'text',
  //   input_type: 'text',
  //   Icon: DocumentNumberIcon,
  // },
  {
    id: 'SLID_001',
    label: 'Slider',
    value: 'slider',
    type: 'range',
    input_type: 'range',
    Icon: SliderIcon,
  },
  {
    id: 'TEMP_001',
    label: 'Temperature',
    value: 'temperature',
    type: 'temp',
    input_type: 'temp',
    Icon: TemperatureIcon,
  },
  // {
  //   id: 'ANNOT_001',
  //   label: "Annotation",
  //   value: "Annotation",
  //   type: "anno",
  //   input_type: "anno",
  //   Icon: AnnotationIcon,
  // },
  {
    id: 'CHECK_001',
    label: 'Checkbox',
    value: 'Checkbox',
    type: 'checkbox',
    input_type: 'checkbox',
    Icon: CheckboxIcon,
  },
  // {
  //   id: 'SPEECH_001',
  //   label: 'Speech Recognition',
  //   value: 'speech_recognition',
  //   type: 'speech_recognition',
  //   input_type: 'speech_recognition',
  //   Icon: SpeechRecognitionIcon,
  // },
  // {
  //   id: 'LOC_001',
  //   label: "Location",
  //   value: "Location",
  //   type: "location",
  //   input_type: "location",
  //   Icon: LocationIcon,
  // },
  {
    id: 'NUM_001',
    label: 'Number',
    value: 'Number',
    type: 'number',
    input_type: 'number',
    Icon: NumberIcon,
  },
  {
    id: 'SIGN_001',
    label: 'Signature',
    value: 'Signature',
    type: 'signature',
    input_type: 'signature',
    Icon: SignatureIcon,
  },
  {
    id: 'INSTRUCT_001',
    label: 'Instruction',
    value: 'Instruction',
    type: 'instruction',
    input_type: 'instruction',
    Icon: InstructionIcon,
  },
  {
    id: 'MEDIA_001',
    label: 'Media',
    value: 'Media',
    type: 'media',
    input_type: 'media',
    Icon: MediaIcon,
  },
];
