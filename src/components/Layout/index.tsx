import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "../tailwind/sidebar";
import { SidebarLayout } from "../tailwind/sidebar-layout";
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
} from "@heroicons/react/20/solid";

import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Layout({ children }: { children?: any }): any {
  const { isSignedIn, user } = useUser();

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          {/* TODO: Add Alertable AI title here */}
          {/* <SidebarHeader></SidebarHeader> */}
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/">
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/events">
                <Square2StackIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter>
            {isSignedIn ? (
              <div className="flex flex-row">
                <UserButton></UserButton>
                <div className="flex flex-col mx-4">
                  <p>{user.fullName}</p>
                  <p>{user.primaryEmailAddress?.toString() ?? ""}</p>
                </div>
              </div>
            ) : (
              <>
                <SidebarSection>
                  <SignInButton />
                </SidebarSection>
                <SidebarSection>
                  <SignUpButton />
                </SidebarSection>
              </>
            )}
          </SidebarFooter>
        </Sidebar>
      }
      navbar={null}
    >
      {children}
    </SidebarLayout>
  );
}
