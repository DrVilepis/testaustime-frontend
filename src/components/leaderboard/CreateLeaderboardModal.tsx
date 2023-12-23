"use client";

import { Group, Button } from "@mantine/core";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";
import { showNotification } from "@mantine/notifications";
import { createLeaderboard } from "../../api/leaderboardApi";
import { CreateLeaderboardError } from "../../types";
import { useTranslation } from "react-i18next";

interface CreateLeaderboardModalProps {
  onCreate: (leaderboardName: string) => void;
}

export const CreateLeaderboardModal = ({
  onCreate,
}: CreateLeaderboardModalProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Formik
        initialValues={{
          leaderboardName: "",
        }}
        onSubmit={async (values) => {
          const result = await createLeaderboard(values.leaderboardName);
          if (typeof result === "object") {
            onCreate(values.leaderboardName);
          } else {
            showNotification({
              title: t("error"),
              color: "red",
              message: {
                [CreateLeaderboardError.AlreadyExists]: t(
                  "leaderboards.leaderboardExists",
                ),
                [CreateLeaderboardError.UnknownError]: t(
                  "leaderboards.leaderboardCreateError",
                ),
              }[result],
            });
          }
        }}
        validationSchema={Yup.object().shape({
          leaderboardName: Yup.string()
            .required(t("leaderboards.validation.required"))
            .min(2, t("leaderboards.validation.min", { min: 2 }))
            .max(32, t("leaderboards.validation.max", { max: 32 }))
            .matches(/^[a-zA-Z0-9]*$/, t("leaderboards.validation.regex")),
        })}
      >
        {() => (
          <Form>
            <FormikTextInput name="leaderboardName" />
            <Group justify="right" mt="md">
              <Button type="submit">{t("leaderboards.create")}</Button>
            </Group>
          </Form>
        )}
      </Formik>
    </>
  );
};
