"use client"

import React from "react";
import { Button } from "@nextui-org/button";
import { Form } from "@nextui-org/form";
import { Input, Textarea} from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";

export default function NewCredentialForm() {
  const [action, setAction] = React.useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));
    
    await fetch("/api/credentials", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setAction(`submit ${JSON.stringify(data)}`);
  }

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      validationBehavior="native"
      onReset={() => setAction("reset")}
      onSubmit={handleSubmit}
    >

      <Input
        isRequired
        errorMessage="Please enter a valid url"
        label="URL"
        labelPlacement="outside"
        name="url"
        placeholder="Enter the url"
        type="url"
      />

      <Input
        isRequired
        errorMessage="Please enter a valid name"
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="Enter the credential name"
        type="text"
      />

      <Input
        isRequired
        errorMessage="Please enter a valid username"
        label="Username"
        labelPlacement="outside"
        name="username"
        placeholder="Enter your username"
        type="text"
      />

      <Input
        isRequired
        errorMessage="Please enter a valid password"
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter the password"
        type="password"
      />

      <Divider className="my-4" />

      <Input
        errorMessage="Please enter a valid alternative username"
        label="Alternative username"
        labelPlacement="outside"
        name="alternative_username"
        placeholder="Enter an alternative username"
        type="text"
      />

      <Textarea 
        className="max-w-xs"
        label="Note" 
        labelPlacement="outside" 
        name="note"
        placeholder="Enter a note" 
      />

      <div className="flex gap-2">
        <Button color="primary" type="submit">
          Submit
        </Button>
        <Button type="reset" variant="flat">
          Reset
        </Button>
      </div>
      {action && (
        <div className="text-small text-default-500">
          Action: <code>{action}</code>
        </div>
      )}
    </Form>
  );
}

