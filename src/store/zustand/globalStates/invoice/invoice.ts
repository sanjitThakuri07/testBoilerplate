import {
  AdjustmentModalProps,
  AdjustmentTriggerProps,
  DraftInvoiceProps,
  GenerateInvoiceProps,
  InvoiceFileProps,
  InvoiceRemarkIndexProps,
  InvoiceRemarkModalProps,
  InvoiceTableAdditionalDataProps,
  InvoiceTableDataProps,
  PriceAdjustmentProps,
  publicInvoiceProps,
  SendInvoiceProps,
  UpdatingAdjustmentProps,
} from 'interfaces/invoice/GenerateInvoiceProps';
import { create } from 'zustand';

export const useBillingInvoceData = create<GenerateInvoiceProps>((set) => ({
  invoiceData: [],
  setInvoiceData: (payload: any) => set({ invoiceData: payload }),
  additionalInvoiceData: [],
  setAdditionalInvoiceData: (payload: any) => set({ additionalInvoiceData: payload }),
}));
export const useAdjustmentData = create<PriceAdjustmentProps>((set) => ({
  adjustmentData: [],
  setAdjustmentData: (payload: any) => set({ adjustmentData: payload }),
}));
export const useInvoiceFile = create<InvoiceFileProps>((set) => ({
  invoiceFile: '',
  setInvoiceFile: (payload: any) => set({ invoiceFile: payload }),
}));
export const useInvoiceTriggred = create<SendInvoiceProps>((set) => ({
  isSendTriggered: false,
  setIsSendTriggered: (payload: boolean) => set({ isSendTriggered: payload }),
  isPrintTriggered: false,
  setIsPrintTriggered: (payload: boolean) => set({ isPrintTriggered: payload }),
}));

export const useDraftTriggered = create<DraftInvoiceProps>((set) => ({
  isDraftTriggered: false,
  setIsDraftTriggered: (payload: boolean) => set({ isDraftTriggered: payload }),
}));

export const usePublicInvoice = create<publicInvoiceProps>((set) => ({
  publicInvoice: false,
  setPublicInvoice: (payload: boolean) => set({ publicInvoice: payload }),
}));

export const triggerAdjustment = create<AdjustmentTriggerProps>((set) => ({
  isAdjustmentTriggered: false,
  setIsAdjustmentTriggered: (payload: boolean) => set({ isAdjustmentTriggered: payload }),
}));

export const useUpdatingAdjustment = create<UpdatingAdjustmentProps>((set) => ({
  updatingAdjustmentId: 0,
  setUpdatingAdjustmentId: (payload: number) => set({ updatingAdjustmentId: payload }),
}));

export const useAdjustmentModal = create<AdjustmentModalProps>((set) => ({
  adjustmentModal: false,
  setAdjustmentModal: (payload: boolean) => set({ adjustmentModal: payload }),
}));

export const useInvoiceRemarkModal = create<InvoiceRemarkModalProps>((set) => ({
  openRemarkModal: false,
  setOpenRemarkModal: (payload: boolean) => set({ openRemarkModal: payload }),
}));

export const useUpdateRemarkIndex = create<InvoiceRemarkIndexProps>((set) => ({
  updateRemarkIndex: 0,
  setUpdateRemarkIndex: (payload: number) => set({ updateRemarkIndex: payload }),
}));

export const useInvoiceTableDatas = create<InvoiceTableDataProps>((set) => ({
  invoiceTableData: [],
  setInvoiceTableData: (payload: any) => set({ invoiceTableData: payload }),
}));
export const useAdditionalPreviewData = create<InvoiceTableAdditionalDataProps>((set) => ({
  additionalPreviewData: [],
  setAdditionalPreviewData: (payload: any) => set({ additionalPreviewData: payload }),
}));
