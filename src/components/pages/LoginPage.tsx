import { Button, Title, LoadingOverlay, Group, createStyles } from "@mantine/core";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { useSearchParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles(() => ({
  loginBox: {
    display: "flex",
    height: "calc(100% - 36px - 50px - 80px)",
    flexDirection: "column",
    width: "100%"
  }
}));

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

export const LoginPage = () => {
  const { login } = useAuthentication();
  const navigate = useNavigate();
  const queryParams = useSearchParams();
  const unsafeRedirect = queryParams[0].get("redirect") || "/";
  const [visible, setVisible] = useState(false);

  const { classes } = useStyles();

  return <Group className={classes.loginBox}>
    <Title order={1} mb={20}>Login</Title>
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required")
      })}
      onSubmit={values => {
        setVisible(true);
        login(values.username, values.password)
          .then(() => navigate(allowedRedirects.includes(unsafeRedirect) ? unsafeRedirect : "/"))
          .catch(() => {
            showNotification({
              title: "Error",
              color: "red",
              message: "Invalid credentials"
            });
            setVisible(false);
          });
      }}>
      {() => <Form style={{ width: "100%" }}>
        <FormikTextInput name="username" label="Username" style={{ width: "100%" }} />
        <FormikPasswordInput name="password" label="Password" mt={15} style={{ width: "100%" }} />
        <Button mt={20} type="submit"><LoadingOverlay visible={visible} />Log in</Button>
      </Form>}
    </Formik>
  </Group>;
};
