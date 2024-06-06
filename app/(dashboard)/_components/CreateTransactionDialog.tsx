"use client"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TransactionTypes } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CreateTransactionSchema, CreateTransactionSchemaType } from '@/schema/transaction'
import { zodResolver } from "@hookform/resolvers/zod"
import React, { ReactNode, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import CategoryPicker from './CategoryPicker'

type Props = {
  trigger: ReactNode
  type: TransactionTypes
}

export const CreateTransactionDialog = ({ trigger, type }: Props) => {

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date()
    }
  })

  const handleCategoryChange = useCallback((value: string) => {
    form.setValue("category", value)
  }, [form])
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4'>
            <FormField control={form.control} name='description' render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input defaultValue={""} {...field} />
                </FormControl>
                <FormDescription>
                  Transaction description (optional)
                </FormDescription>
              </FormItem>
            )} />
            <FormField control={form.control} name='amount' render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input defaultValue={0} type='number' {...field} />
                </FormControl>
                <FormDescription>
                  Transaction amount (required)
                </FormDescription>
              </FormItem>
            )} />
            <div className='flex items-center justify-between gap-2'>
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryPicker type={type} onChange={handleCategoryChange} />
                  </FormControl>
                  <FormDescription>
                    Category (required)
                  </FormDescription>
                </FormItem>
              )} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
