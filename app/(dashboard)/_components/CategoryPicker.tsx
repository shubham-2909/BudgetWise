"use client"
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TransactionTypes } from '@/lib/types'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import CreateCategoryDialog from './CreateCategoryDialog'
import { CommandItem } from 'cmdk'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  type: TransactionTypes,
  onChange: (value: string) => void
}

function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  useEffect(() => {
    if (!value) return
    onChange(value)
  }, [value, onChange])
  const categoryQuery = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch(`/api/categories?type=${type}`).then(res => res.json())
  })
  const selectedCategory = categoryQuery.data?.find(
    (category: Category) => category.name === value
  );

  const successCallBack = useCallback((category: Category) => {
    setValue(category.name)
    setOpen((prev) => !prev)
  }, [setOpen, setValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={`outline`} className='w-[200px] justify-between' aria-expanded={open} role='combo'>
          {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select Category"}
          <ChevronsUpDown className='ml-2 opacity-50 shrink h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallBack={successCallBack} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className='text-xs text-muted-foreground '>
              Tip:Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryQuery.data?.map((category: Category) => (<CommandItem key={category.name} onSelect={() => {
                setValue(category.name)
                setOpen((prev) => !prev)
              }} className='p-1'>
                <div className='flex gap-1 flex-nowrap items-center cursor-pointer'>
                  <CategoryRow category={category} />
                  <Check className={cn("mr-4 w-4 h-4 opacity-0", value === category.name && "opacity-100")} />
                </div>
              </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CategoryPicker

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className='flex items-center gap-2'>
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  )
}
