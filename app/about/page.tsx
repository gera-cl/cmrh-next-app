import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { getSession } from "@/lib/auth";
import { 
  TbShield, 
  TbKey, 
  TbUsers, 
  TbLock, 
  TbEye, 
  TbDevices,
  TbPlus 
} from "react-icons/tb";

export default async function AboutPage() {
  const session = await getSession();

  const features = [
    {
      icon: TbShield,
      title: "End-to-End Encryption",
      description: "AES-GCM encryption ensures your sensitive data stays secure"
    },
    {
      icon: TbKey,
      title: "Secure Authentication",
      description: "Google OAuth integration with NextAuth.js for trusted access"
    },
    {
      icon: TbUsers,
      title: "Team Management",
      description: "Safely share credentials with authorized team members"
    },
    {
      icon: TbLock,
      title: "Zero Knowledge",
      description: "Your encryption keys never leave your control"
    },
    {
      icon: TbEye,
      title: "Audit Trail",
      description: "Track who accessed what and when for complete transparency"
    },
    {
      icon: TbDevices,
      title: "Cross-Platform",
      description: "Access your credentials securely from any device"
    }
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
      {/* Hero Section */}
      <div className="inline-block max-w-4xl text-center justify-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <TbShield className="text-5xl text-primary" />
          <span className={title()}>Cumorah</span>
        </div>
        <div className="mb-4">
          <span className={title({ color: "violet" })}>Secure&nbsp;</span>
          <span className={title()}>Credentials Manager</span>
        </div>
        <div className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
          Keep your valuable information hidden with enterprise-grade encryption.
          Safely store and manage sensitive credentials for your team.
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Chip color="primary" variant="flat">🔐 AES-GCM Encryption</Chip>
          <Chip color="secondary" variant="flat">🚀 Next.js 15</Chip>
          <Chip color="success" variant="flat">🛡️ Zero Knowledge</Chip>
          <Chip color="warning" variant="flat">👥 Team Collaboration</Chip>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
            size: "lg"
          })}
          href="/"
        >
          <TbKey className="mr-2" />
          View Credentials
        </Link>
        <Link
          className={buttonStyles({ 
            variant: "bordered", 
            radius: "full",
            size: "lg"
          })}
          href="/credentials/new"
        >
          <TbPlus className="mr-2" />
          Add New Credential
        </Link>
      </div>

      <Divider className="my-8 max-w-4xl" />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-content1 rounded-large p-6 shadow-medium hover:shadow-large transition-shadow">
            <div className="text-center">
              <feature.icon className="text-4xl text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-default-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      {!session && (
        <>
          <Divider className="my-8 max-w-4xl" />
          <div className="bg-warning-50 dark:bg-warning-100/10 border border-warning-200 dark:border-warning-200/20 rounded-large p-6 max-w-2xl mx-4">
            <div className="text-center">
              <TbShield className="text-4xl text-warning mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-warning-600 dark:text-warning">
                Private Repository
              </h3>
              <p className="text-warning-700 dark:text-warning-300 mb-6 leading-relaxed">
                This project is restricted to authorized team members only. 
                Please sign in with your authorized Google account to access the credentials manager.
              </p>
              <Link
                className={buttonStyles({
                  color: "warning",
                  radius: "full",
                  variant: "flat",
                })}
                href="/api/auth/signin"
              >
                <TbLock className="mr-2" />
                Authorize Access
              </Link>
            </div>
          </div>
        </>
      )}

      {/* User Status */}
      {session && (
        <>
          <Divider className="my-8 max-w-4xl" />
          <div className="bg-success-50 dark:bg-success-100/10 border border-success-200 dark:border-success-200/20 rounded-large p-6 max-w-2xl mx-4">
            <div className="text-center">
              <TbUsers className="text-4xl text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-success-600 dark:text-success">
                Welcome back, {session.user?.name}!
              </h3>
              <p className="text-success-700 dark:text-success-300 mb-6">
                You are authenticated and ready to manage your secure credentials.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  className={buttonStyles({
                    color: "success",
                    radius: "full",
                    variant: "flat",
                  })}
                  href="/"
                >
                  <TbKey className="mr-2" />
                  Manage Credentials
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
