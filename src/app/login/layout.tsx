import AuthLayout from '@/core/ui/zenlots/src/layouts/AuthLayout';
import Link from 'next/link';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      backgroundImage="/images/background.jpg"
      title="Time Planner"
    >
      {children}
    </AuthLayout>
  );
}
