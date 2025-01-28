"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Divider } from "@heroui/divider";

import { CredentialDto } from "@/lib/services/credentials.service";

export default function CredentialForm(props: {
  credential?: Partial<CredentialDto>;
  handleSubmit: (credential: Partial<CredentialDto>) => Promise<void>;
  className?: string;
}) {
  const isEditing = Boolean(props.credential);
  const [credential, setCredential] = React.useState<
    Partial<CredentialDto> | undefined
  >(props.credential);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    if (credential) await props.handleSubmit(credential);

    setIsLoading(false);
  };

  return (
    <Form
      className={"flex flex-col gap-4 px-4 " + props.className}
      validationBehavior="native"
      onReset={() => setCredential(props.credential)}
      onSubmit={handleSubmit}
    >
      <span className="text-xl">New credential</span>
      <Input
        isRequired
        errorMessage="Please enter a valid url"
        label="URL"
        labelPlacement="outside"
        name="url"
        placeholder="Enter the url"
        type="url"
        value={credential?.url || ""}
        onChange={(e) => setCredential({ ...credential, url: e.target.value })}
      />

      <Input
        isRequired
        errorMessage="Please enter a valid name"
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="Enter the credential name"
        type="text"
        value={credential?.name || ""}
        onChange={(e) => setCredential({ ...credential, name: e.target.value })}
      />

      <Input
        isRequired
        errorMessage="Please enter a valid username"
        label="Username"
        labelPlacement="outside"
        name="username"
        placeholder="Enter your username"
        type="text"
        value={credential?.username || ""}
        onChange={(e) =>
          setCredential({ ...credential, username: e.target.value })
        }
      />

      <Input
        isRequired
        errorMessage="Please enter a valid password"
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter the password"
        type="password"
        value={credential?.password || ""}
        onChange={(e) =>
          setCredential({ ...credential, password: e.target.value })
        }
      />

      <Divider className="my-4" />

      <Input
        errorMessage="Please enter a valid alternative username"
        label="Alternative username"
        labelPlacement="outside"
        name="alternative_username"
        placeholder="Enter an alternative username"
        type="text"
        value={credential?.alternative_username || ""}
        onChange={(e) =>
          setCredential({
            ...credential,
            alternative_username:
              e.target.value.trim().length > 0 ? e.target.value : undefined,
          })
        }
      />

      <Textarea
        label="Note"
        labelPlacement="outside"
        name="note"
        placeholder="Enter a note"
        value={credential?.note || ""}
        onChange={(e) =>
          setCredential({
            ...credential,
            note: e.target.value.trim().length > 0 ? e.target.value : undefined,
          })
        }
      />

      <div className="w-full gap-2 flex flex-col-reverse sm:flex-row sm:justify-end">
        {isEditing && (
          <Button
            className="mr-auto"
            color="danger"
            type="button"
            variant="flat"
          >
            Delete
          </Button>
        )}
        {/* todo: add reset */}
        <Button isDisabled type="reset" variant="flat">
          Reset
        </Button>
        <Button
          className="w-40"
          color="primary"
          isDisabled={
            isLoading ||
            JSON.stringify(props.credential) === JSON.stringify(credential)
          }
          isLoading={isLoading}
          type="submit"
        >
          {isEditing ? "Update" : "Create"}
        </Button>
      </div>
      {false && credential && (
        <div className="text-small text-default-500">
          <p>
            <code>{JSON.stringify(credential)}</code>
          </p>
        </div>
      )}
    </Form>
  );
}
