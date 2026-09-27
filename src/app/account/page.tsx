import type { Metadata } from "next";
import { AccountView } from "@/components/account-view";

export const metadata: Metadata = {
  title: "حساب کاربری",
  description: "اطلاعات شخصی، آدرس‌ها، ترجیحات و امنیت حساب لومرا.",
};

export default function AccountPage() {
  return <AccountView />;
}
