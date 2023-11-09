import { useFetcher } from "@remix-run/react";
import { Heading } from "~/components/atoms/Heading/Heading";
import { Button } from "~/components/atoms/button";
import { TextInput, TextInputData } from "~/components/molecules/TextInput/TextInput";
import styles from "./email-form.css";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type InputData = TextInputData[];

type EmailFormProps = {
  inputData: InputData;
  formTitle: string;
  formDescription: string;
};

function EmailForm({ inputData, formTitle, formDescription }: EmailFormProps) {
  const fetcher = useFetcher();
  return (
    <section className="form">
      <Heading as="h2">{formTitle}</Heading>
      <p>{formDescription}</p>
      <fetcher.Form method="post">
        {inputData.map((input) => (
          <TextInput key={input.label} type={input.type} label={input.label} />
        ))}
      </fetcher.Form>
      <Button type={"submit"} variant={"contained"} isInverse={true}>
        Submit
      </Button>
    </section>
  );
}

export { EmailForm };
