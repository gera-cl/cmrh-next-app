"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Alert } from "@heroui/alert";
import { useDisclosure } from "@heroui/modal";

import ConfirmationDialog from "@/components/confirmation-dialog";
import { CredentialDto } from "@/lib/services/credentials.service";
import { TbArrowBack } from "react-icons/tb";

export default function CredentialForm(props: {
  handleSubmit: (credential: Partial<CredentialDto>) => Promise<{ id: number } | null>;
  handleDelete?: (id: string) => Promise<boolean>;
  handleDeleteSuccess?: () => Promise<void>;
  credential?: Partial<CredentialDto>;
  className?: string;
}) {
  const isEditing = Boolean(props.credential);
  const [credential, setCredential] = React.useState<
    Partial<CredentialDto> | undefined
  >(props.credential);
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"successful" | "failed" | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createdCredential, setCreatedCredential] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitLoading(true);
    e.preventDefault();

    if (credential) {
      const result = await props.handleSubmit(credential);
      setStatus(result ? "successful" : "failed");

      if (isEditing) {
      } else {
        if (result) {
          setCreatedCredential(result ? result.id.toString() : null);
          setCredential(undefined)
        }
      }
    }

    setIsSubmitLoading(false);
  };

  const handleDelete = () => {
    return props.handleDelete!((props.credential?.id!).toString())
  }

  return (
    <>
      <Form
        className={"flex flex-col gap-4 px-4 " + props.className}
        validationBehavior="native"
        onReset={() => setCredential(props.credential)}
        onSubmit={handleSubmit}
      >
        <div className="w-full flex justify-between items-center">
          <span className="text-xl">{isEditing ? "Edit" : "Add"} credential</span>
          <Button
            as={Link}
            color="secondary"
            href="/credentials"
            variant="flat"
            endContent={<TbArrowBack className="text-lg" />}
          >
            Go back
          </Button>
        </div>
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
        {status && (
          <div className="w-full flex items-center my-3">
            <Alert
              color={status === "successful" ? "success" : "danger"}
              title={`Credential ${isEditing ? "updated" : "created"} ${status === "successful" ? "successfully" : "with errors"}`}
              endContent={status === "successful" && !isEditing &&
                <Button as={Link} href={`/credentials/${createdCredential}`} color="success" size="sm" variant="flat">
                  View Credential
                </Button>
                || status === "failed" &&
                <Button size="sm" variant="flat" type="submit" color="danger">Retry</Button>
              }
            />
          </div>
        )}
        <div className="w-full gap-2 flex flex-col-reverse sm:flex-row sm:justify-end">
          {isEditing && (
            <Button
              className="sm:mr-auto"
              color="danger"
              type="button"
              variant="flat"
              onPress={() => onOpen()}
              isDisabled={isSubmitLoading}
            >
              Delete
            </Button>
          )}
          <Button isDisabled type="reset" variant="flat">
            Reset
          </Button>
          <Button
            className="sm:w-40"
            color="primary"
            isDisabled={
              isSubmitLoading ||
              JSON.stringify(props.credential) === JSON.stringify(credential)
            }
            isLoading={isSubmitLoading}
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
      {isEditing && (
        <ConfirmationDialog
          dialogBody={
            <p>
              Are you sure you want to delete this credential?
            </p>
          }
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
