"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TransactionTypes } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/category"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleOff, Loader2, PlusSquare } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateCategory } from "../_actions/categories"
import { toast } from "sonner"
import { Category } from "@prisma/client"
import React from "react"
import { useTheme } from "next-themes"
type Props = {
  type: TransactionTypes
  successCallBack: (category: Category) => void
}
const CreateCategoryDialog = ({ type, successCallBack }: Props) => {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type
    }
  })
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      toast.success(`Category ${data.name} created successfully 💯`, {
        id: "create-category"
      })
      form.reset({
        name: "",
        icon: "",
        type
      })
      successCallBack(data)
      await queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
      setOpen(prev => !prev)
    },
    onError: (err) => {
      toast.error(err.message, {
        id: "create-category"
      })
    }
  })

  const onSubmit = React.useCallback((values: CreateCategorySchemaType) => {
    toast.loading("Creating Category...", {
      id: "create-category"
    })
    mutate(values)
  }, [mutate])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" className="flex justify-start items-center border-separate rounded-none border-b px-3 py-3 text-muted-foreground w-full">
          <PlusSquare className="mr-2 w-4 h-4" />Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-rose-500")}>{type}
            </span>
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>
                <FormDescription>
                  This is how your category will appear
                </FormDescription>
              </FormItem>
            )} />
            <FormField control={form.control} name='icon' render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="h-[100px] w-full"
                      >
                        {form.watch("icon") ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-5xl" role="img">
                              {field.value}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Click to change
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <CircleOff className="h-[48px] w-[48px]" />
                            <p className="text-xs text-muted-foreground">
                              Click to select
                            </p>
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <Picker data={data} theme={theme.resolvedTheme} onEmojiSelect={(emoji: { native: string }) => {
                        field.onChange(emoji.native)
                      }} />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>
                  This is how your category will appear in the app
                </FormDescription>
              </FormItem>
            )} />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} >
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default CreateCategoryDialog
