export type NotificationsType = "email" | "sms" | "app";

export interface Notifications {
  notify_tenant_signup_through?: NotificationsType[];
  notify_when_tenant_create_new_org_through?: NotificationsType[];
  notify_when_tenant_change_billing_plans_through?: NotificationsType[];
  notify_when_tenant_create_new_organization?: NotificationsType[];
  notify_when_organization_deactivated?: NotificationsType[];
  [key: string]: any;
}
