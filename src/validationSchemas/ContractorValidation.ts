import * as Yup from 'yup';

export const emailValidationSchema = Yup.object().shape({
  email: Yup.array()
    .min(1, 'At least one email is required')
    .of(Yup.string().email('Invalid email format'))
    .required('At least one email is required'),
});

export const phoneNumberValidationSchema = Yup.object().shape({
  phoneNumber: Yup.array()
    // .min(1, 'At least one phone number is required')
    .of(
      Yup.object().shape({
        code: Yup.string().required('Code is required'),
        phone: Yup.string()
          .matches(/^\d{7,15}$/, 'Invalid phone number format')
          .required('Phone number is required'),
      }),
    )
    .required('At least one phone number is required'),
});

export const allContractorValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is a required field').max(50),
  country: Yup.string().nullable(),
  phone: phoneNumberValidationSchema.fields.phoneNumber,
  industry: Yup.string().nullable(),
  location: Yup.string()
    .min(3, 'Location must be at least 3 character long')
    .max(50, 'Location must be at most 50 character long')
    .nullable(),
  email_id: emailValidationSchema.fields.email,
  operations_email: emailValidationSchema.fields.email,
  invoice_emails: emailValidationSchema.fields.email,
  status: Yup.string().required('Status is a required field'),
  language: Yup.string().nullable(),
  // services: Yup.string().nullable().required('Services is a required field'),
  services: Yup.array().of(Yup.string()).nullable().required('Services is a required field'),
   
});

export const allCustomerValidation = Yup.object().shape({
  organization_name: Yup.string().required('Organization name is a required field').max(50),
  country: Yup.string().nullable().required('Please select country'),
  // phone_numbers: phoneNumberValidationSchema.fields.phoneNumber,
  organizations_email: emailValidationSchema.fields.email,
  operations_email: emailValidationSchema.fields.email,
  invoice_email: emailValidationSchema.fields.email,
  phone: phoneNumberValidationSchema.fields.phoneNumber,
  // business_invoice_type: Yup.string().required(
  //   "Business invoice type is a required field"
  // ),
});

interface Customer {
  full_name?: string;
  login_email?: string;
}

export const AddCustomerValidation = Yup.object().shape({
  customers: Yup.array()
    .of(
      Yup.object().shape({
        full_name: Yup.string().required('Name is required'),
        login_email: Yup.string().email('Invalid email').required('Email is required'),
      }),
    )
    .test('checkLoginEmails', 'Login Emails must be unique', function (customers) {
      const loginEmails = customers?.map((customer: Customer) => customer.login_email);
      const uniqueEmails = new Set(loginEmails);
      return uniqueEmails.size === customers?.length;
    }),
});

export const AddressValidationSchema = Yup.object().shape({
  address_type: Yup.string().required('Address type is required'),
  // address_line: Yup.string().required('Address line is required'),
  // city: Yup.string().nullable(),
  // state: Yup.string().nullable(),
  // territory: Yup.number()
  //   .transform((value) => (Number.isNaN(value) ? null : value))
  //   .nullable()
  //   .required('Territory is required'),
  country: Yup.number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Country is required'),
  // zip_code: Yup.string()
  //   // .required('Zip code is required')
  //   .max(12, 'Zip code can not be more than 12 characters'),
});

export const CustomerAddressValidationSchema = Yup.object().shape({
  address: Yup.array().of(
    Yup.object().shape({
      address_type: Yup.string().required('Address Type is required'),
      country: Yup.string().required('Country is required'),
      // territory: Yup.string().required('Territory is required').nullable(),
      // city: Yup.string().required('City is required'),
      // state: Yup.string().required('State/Province is required'),
      // address_line: Yup.string().required('Address Line is required'),
      // zip_code: Yup.string().required('Zip Code is required'),
    }),
  ),
});

export const AddressValidationSchemaCustomer = Yup.object().shape({
  address_type: Yup.string().required('Address type is required'),
  address_line: Yup.string().required('Address line is required'),
  // city: Yup.string().required('City is required'),
  // state: Yup.string().required('State is required'),
  // territory: Yup.number().required('Territory is required'),
  country: Yup.number().required('Country is required'),

  // territory: Yup.number().required("Territory is required"),
  // city: Yup.string().required("City is required"),
  // state: Yup.string().required("State is required"),
  // territory: Yup.number(),
  // city: Yup..,
  // state: Yup.string(),

  zip_code: Yup.string().max(12, 'Zip code can not be more than 12 characters'),
});

export const allContractorAddressValidationSchema = Yup.object().shape({
  address: Yup.array().of(AddressValidationSchema).min(1, 'At least one address is required'),
});

// export const findingsAndRecommendationsValidationSchema = Yup.object().shape({
//   category: Yup.array().of(
//     Yup.object().shape({
//       name: Yup.string().required('Category name is required'),
//       status: Yup.string()
//         .oneOf(['Active', 'Inactive'], 'Invalid category status')
//         .required('Category status is required'),
//       notes: Yup.string().max(300, 'Notes must be at most 300 characters long'),
//     }),
//   ),
//   findings: Yup.array().of(
//     Yup.object().shape({
//       description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
//       risk_factor: Yup.string()
//         .oneOf(['Low', 'Medium', 'High'], 'Invalid risk factor')
//         .required('Risk factor is required'),
//       attachments: Yup.array(),
//       recommendations: Yup.array().of(
//         Yup.object().shape({
//           description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
//           attachments: Yup.array(),
//         }),
//       ),
//     }),
//   ),
// });

export const findingsAndRecommendationsValidationSchema = Yup.object().shape({
  newValues: Yup.array().of(
    Yup.object().shape({
      category: Yup.object().shape({
        name: Yup.string().required('Category name is required'),
        status: Yup.string()
          .oneOf(['Active', 'Inactive'], 'Invalid category status')
          .required('Category status is required'),
        notes: Yup.string().max(300, 'Notes must be at most 300 characters long'),
      }),
      findings: Yup.array().of(
        Yup.object().shape({
          description: Yup.string()
            .required('Finding is a required field')
            .max(300, 'Notes must be at most 300 characters long'),
          risk_factor: Yup.string()
            .oneOf(['Low', 'Medium', 'High'], 'Invalid risk factor')
            .required('Risk factor is required'),
          attachments: Yup.array(),
          recommendations: Yup.array().of(
            Yup.object().shape({
              description: Yup.string()
                .max(300, 'Notes must be at most 300 characters long')
                .required('Recommendation is a required field'),
              attachments: Yup.array(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export const findingsAndRecommendationsValidationSchemaSubCategory = Yup.object().shape({
  category: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Sub category name is required'),
      status: Yup.string()
        .oneOf(['Active', 'Inactive'], 'Invalid sub category status')
        .required('Category status is required'),
      notes: Yup.string().max(300, 'Notes must be at most 300 characters long'),
    }),
  ),
  findings: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
      risk_factor: Yup.string()
        .oneOf(['Low', 'Medium', 'High', 'N/A'], 'Invalid risk factor')
        .required('Risk factor is required'),
      attachments: Yup.array(),
      recommendations: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
          attachments: Yup.array(),
        }),
      ),
    }),
  ),
});

export const IndividualFindingsAndMultipleRecommendationValidationSchema = Yup.object().shape({
  findings: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
      risk_factor: Yup.string()
        .oneOf(['Low', 'Medium', 'High', 'N/A'], 'Invalid risk factor')
        .required('Risk factor is required'),
      attachments: Yup.array(),
      recommendations: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
          attachments: Yup.array(),
        }),
      ),
    }),
  ),
});

export const IndividualRecommendationValidationSchema = Yup.object().shape({
  recommendations: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().max(300, 'Notes must be at most 300 characters long'),
      attachments: Yup.array(),
    }),
  ),
});

export const TariffValidationSchema = Yup.object().shape({
  address: Yup.array().of(
    Yup.object().shape({
      customer: Yup.string().nullable().required('Customer is a required field'),
      begin_date: Yup.date().required('Begin date is required'),
      end_date: Yup.date()
        .required('End date is required')
        .test(
          'is-greater-than-begin-date',
          'End date must be greater than begin date',
          function (endDate) {
            const beginDate: any = this.parent.begin_date;
            if (beginDate && endDate) {
              return new Date(endDate) >= new Date(beginDate);
            }
            return true;
          },
        ),
    }),
  ),
});

export const RecordValidationSchema = Yup.object().shape({
  address: Yup.array().of(
    Yup.object().shape({
      // billing_agreement_type: Yup.string()
      //   .nullable()
      //   .required('Billing agreement type is a required field'),
      inspection: Yup.array().of(Yup.string()).nullable().min(1, 'Inspection is required'),
      // .min(1, 'At least one inspection is required')
      // .required('At least one inspection is required'),
      location: Yup.array()
        .min(1, 'At least one location is required')
        .required('At least one location is required'),
      status: Yup.string().nullable().required('Status is a required field'),
      // currency: Yup.string().nullable().required('Currency is a required field'),
      // rates: Yup.array().of(Yup.object().shape({
      //   rate_type: Yup.s
      // }))
    }),
  ),
});
