export interface GenerateInvoiceProps {
  invoiceData: any;
  setInvoiceData: (value: string[]) => void;
  additionalInvoiceData: any;
  setAdditionalInvoiceData: (value: string[]) => void;
}
export interface PriceAdjustmentProps {
  adjustmentData: any;
  setAdjustmentData: (value: any) => void;
}
export interface SendInvoiceProps {
  isSendTriggered: boolean;
  setIsSendTriggered: (value: boolean) => void;

  isPrintTriggered: boolean;
  setIsPrintTriggered: (value: boolean) => void;
}
export interface DraftInvoiceProps {
  isDraftTriggered: boolean;
  setIsDraftTriggered: (value: boolean) => void;
}
export interface InvoiceFileProps {
  invoiceFile: any;
  setInvoiceFile: (value: any) => void;
}

export interface publicInvoiceProps {
  publicInvoice: any;
  setPublicInvoice: (value: any) => void;
}

export interface AdjustmentTriggerProps {
  isAdjustmentTriggered: boolean;
  setIsAdjustmentTriggered: (value: boolean) => void;
}

export interface UpdatingAdjustmentProps {
  updatingAdjustmentId: number;
  setUpdatingAdjustmentId: (value: number) => void;
}

export interface AdjustmentModalProps {
  adjustmentModal: boolean;
  setAdjustmentModal: (value: boolean) => void;
}

export interface InvoiceRemarkModalProps {
  openRemarkModal: boolean;
  setOpenRemarkModal: (value: boolean) => void;
}

export interface InvoiceRemarkIndexProps {
  updateRemarkIndex: number;
  setUpdateRemarkIndex: (value: number) => void;
}

export interface InvoiceTableDataProps {
  invoiceTableData: any;
  setInvoiceTableData: (value: any) => void;
}
export interface InvoiceTableAdditionalDataProps {
  additionalPreviewData: any;
  setAdditionalPreviewData: (value: any) => void;
}
