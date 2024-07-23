import styles from "./Header.module.css";

import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className={styles.header}>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div>
          <SignInButton />
          &nbsp;
          <SignUpButton />
        </div>
      )}
      <div style={{ marginLeft: 10 }}>Alertful AI</div>
    </header>
  );
};
