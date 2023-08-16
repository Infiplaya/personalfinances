"use client";

import React, { useState } from "react";
import { Dialog, InterceptedDialogContent } from "@/components/ui/dialog";
import { Category } from "@/db/schema/finances";
import { TransactionForm } from "./transaction-form";

export default function NewTransactionDialog({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <Dialog open>
      <InterceptedDialogContent>
        <TransactionForm categories={categories} />
      </InterceptedDialogContent>
    </Dialog>
  );
}
