"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const models = [
  { value: "llama3-70b-8192", label: "Llama 3 70B" },
  { value: "llama3-8b-8192", label: "Llama 3 8B" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
  { value: "gemma-7b-it", label: "Gemma 7B" },
]

interface ChatSettingsProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  model: string
  onModelChange: (model: string) => void
  temperature: number
  onTemperatureChange: (temperature: number) => void
  maxTokens: number
  onMaxTokensChange: (maxTokens: number) => void
}

export function ChatSettings({
  open,
  onOpenChange,
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
}: ChatSettingsProps) {
  const [modelOpen, setModelOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cài đặt trò chuyện</SheetTitle>
          <SheetDescription>Cấu hình mô hình và tham số cho cuộc trò chuyện của bạn.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="model">Mô hình</Label>
            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={modelOpen} className="w-full justify-between">
                  {model ? models.find((m) => m.value === model)?.label : "Chọn mô hình..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm kiếm mô hình..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy mô hình.</CommandEmpty>
                    <CommandGroup>
                      {models.map((m) => (
                        <CommandItem
                          key={m.value}
                          value={m.value}
                          onSelect={(currentValue) => {
                            onModelChange(currentValue)
                            setModelOpen(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", model === m.value ? "opacity-100" : "opacity-0")} />
                          {m.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Nhiệt độ: {temperature.toFixed(1)}</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => onTemperatureChange(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Giá trị cao hơn tạo ra các phản hồi sáng tạo hơn, giá trị thấp hơn sẽ ổn định hơn.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-tokens">Số token tối đa: {maxTokens}</Label>
            </div>
            <Slider
              id="max-tokens"
              min={256}
              max={8192}
              step={256}
              value={[maxTokens]}
              onValueChange={(value) => onMaxTokensChange(value[0])}
            />
            <p className="text-xs text-muted-foreground">Số lượng token tối đa để tạo ra trong phản hồi.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

