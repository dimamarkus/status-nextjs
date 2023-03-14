"use client";
import styles from "./SignUp.module.scss";

import { useAuthContext, VIEWS } from "#/lib/contexts/AuthContext";
import Button from "#/ui/atoms/buttons/Button/Button";
import Card from "#/ui/containers/Card/Card";
import SignUpForm from "#/ui/molecules/forms/SignUpForm/SignUpForm";

export const SignUp = () => {
  const { setView } = useAuthContext();

  return (
    <Card className={styles.SignUp}>
      <h2 className="w-full text-center">Create Account</h2>
      <SignUpForm />
      <Button type="link" onClick={() => setView(VIEWS.SIGN_IN)}>
        Already have an account? Sign In.
      </Button>
    </Card>
  );
};

export default SignUp;
