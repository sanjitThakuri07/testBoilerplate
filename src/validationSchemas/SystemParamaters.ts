import * as yup from 'yup';

export const checkNumber = ({ schema, field, min = 5, max = 100 }: any) => {
  return schema
    ?.test({
      name: 'number',
      message: (value: any) => {
        console.log(isNaN(value?.value));
        return !Number(value?.value)
          ? `${field || 'Input'} must be a number`
          : `${field} count (${value?.value}) must be within range ${min} to ${max}`;
      },
      test: (value: any) => {
        return Number(value) >= min && Number(value) <= max;
      },
    })
    .nullable();
};

export const SystemParamatersSchema = (values: any) => {
  return yup.object().shape({
    rows_count: yup.number().test({
      name: 'number',
      message: (value: any) => {
        return `Number of rows count (${value?.value}) must be within range 5 to 100`;
      },
      test: (value: any) => {
        return Number(value) >= 5 && Number(value) <= 100;
      },
    }),

    region: yup.boolean().required(),
    region_code_length: yup.number().when('region', {
      is: true,
      then: checkNumber({ schema: yup.number(), field: 'Region code length', min: 1, max: 8 }),
      otherwise: yup.number().notRequired().nullable(),
    }),

    territory: yup.boolean().required(),
    territory_code_length: yup.number().when('territory', {
      is: true,
      then: checkNumber({ schema: yup.number(), field: 'Territory code length', min: 1, max: 8 }),
      otherwise: yup.number().notRequired().nullable(),
    }),

    inspection_type: yup.boolean().required(),

    inspection_type_code_length: yup.number().when('inspection_type', {
      is: true,
      then: checkNumber({
        schema: yup.number(),
        field: 'Inspection type code length',
        min: 1,
        max: 8,
      }),
      otherwise: yup.number().notRequired().nullable(),
    }),

    customer: yup.boolean().required(),
    customer_code_length: yup.number().when('customer', {
      is: true,
      then: checkNumber({ schema: yup.number(), field: 'Territory code length', min: 1, max: 8 }),
      otherwise: yup.number().notRequired().nullable(),
    }),
    quotation_prefix: values.quotation
      ? yup
          .string()
          .required('Quotation prefix is required')
          .max(7, 'Max 7 characters')
          .min(1, 'Min 1 character')
          .nullable()
      : yup.string().nullable().notRequired(),
    quotation_start_with: values.quotation
      ? yup
          .string()
          .typeError('Quotation Start with must be a number')
          .required('Quotation start with is required')
      : yup.number().notRequired().nullable(),
    quotation_code_length: values.quotation
      ? checkNumber({ schema: yup.number(), field: 'Quotation code length', min: 1, max: 8 })
      : yup.number().notRequired().nullable(),

    // booking: yup.boolean().required(),
    booking_prefix: values.booking
      ? yup
          .string()
          .required('Booking prefix is required')
          .max(7, 'Max 7 characters')
          .min(1, 'Min 1 character')
          .nullable()
      : yup.string().nullable().notRequired(),
    booking_start_with: values.booking
      ? yup
          .string()
          .typeError('Booking Start with must be a number')
          .required('Booking start with is required')
      : yup.number().notRequired().nullable(),
    booking_code_length: values.booking
      ? checkNumber({ schema: yup.number(), field: 'Booking code length', min: 1, max: 8 })
      : yup.number().notRequired().nullable(),

    // invoice: yup.boolean().required(),
    invoice_prefix: values.invoice
      ? yup
          .string()
          .required('Invoice prefix is required')
          .max(7, 'Max 7 characters')
          .min(1, 'Min 1 character')
          .nullable()
      : yup.string().nullable().notRequired(),
    invoice_start_with: values.invoice
      ? yup
          .string()
          .typeError('Invoice Start with must be a number')
          .required('Invoice start with is required')
      : yup.number().notRequired().nullable(),
    invoice_code_length: values.invoice
      ? checkNumber({ schema: yup.number(), field: 'Invoice code length', min: 1, max: 8 })
      : yup.number().notRequired().nullable(),

    // activity: yup.boolean().required(),
    activity_prefix: values.activity
      ? yup
          .string()
          .required('Activity prefix is required')
          .max(7, 'Max 7 characters')
          .min(1, 'Min 1 character')
          .nullable()
      : yup.string().nullable().notRequired(),
    activity_start_with: values.activity
      ? yup
          .string()
          .typeError('Activity Start with must be a number')
          .required('Activity start with is required')
      : yup.number().notRequired().nullable(),
    activity_code_length: values.activity
      ? checkNumber({ schema: yup.number(), field: 'Activity code length', min: 1, max: 8 })
      : yup.number().notRequired().nullable(),

    // tarrif: yup.boolean().required(),
    tarrif_prefix: values.tarrif
      ? yup
          .string()
          .required('Tarrif prefix is required')
          .max(7, 'Max 7 characters')
          .min(1, 'Min 1 character')
          .nullable()
      : yup.string().nullable().notRequired(),
    tarrif_start_with: values.tarrif
      ? yup
          .string()
          .typeError('Tarrif Start with must be a number')
          .required('Tarrif start with is required')
      : yup.number().notRequired().nullable(),
    tarrif_code_length: values.tarrif
      ? checkNumber({ schema: yup.number(), field: 'Tarrif code length', min: 1, max: 8 })
      : yup.number().notRequired().nullable(),
  });
};
