import * as yup from 'yup';

const NotificationSchema = yup.object().shape({
    notify_tenant_signup_through: yup.array().of(yup.string()).nullable(),
    notify_when_tenant_create_new_org_through: yup.array().of(yup.string()).nullable(),
    notify_when_tenant_change_billing_plans_through: yup.array().of(yup.string()).nullable()
})

export default NotificationSchema;