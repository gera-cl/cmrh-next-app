"use client"

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

export default function ConfirmationDialog(props: {
  dialogBody: React.ReactNode;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  onConfirm: () => Promise<boolean>;
}) {

  type DialogStatus = "idle" | "loading" | "success" | "error";
  const [status, setStatus] = React.useState<DialogStatus>("idle");

  const handleConfirm = async () => {
    setStatus("loading");
    const result = await props.onConfirm();
    setStatus(result ? "success" : "error");
  };

  useEffect(() => {
    if (status !== "loading" && status !== "idle") {
      sleep(400).then(() => {
        if (status === "success") redirect('/');
      }).finally(() => {
        props.onClose();
        setStatus("idle");
      })
    }
  }, [status]);

  return (
    <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Action Confirmation</ModalHeader>
            <ModalBody>
              {props.dialogBody}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color={status === "success" ? "success" : status === "error" ? "danger" : "primary"}
                isLoading={status === 'loading'}
                onPress={handleConfirm}
              >
                {status === "success" ? "Done" : status === "error" ? "Failed" : "Confirm"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function sleep(milliseconds: number, callback?: () => void): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (callback) callback(); // Execute callback if provided
      resolve();
    }, milliseconds);
  });
}
