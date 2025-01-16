'use client'

import * as React from 'react'
import {
  Bell,
  CreditCard,
  Home,
  NotepadText,
  Settings,
  Trello,
  User,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Encontre o que procura..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Sugestões">
            <CommandItem>
              <Home />
              <span>Inicio</span>
            </CommandItem>
            <CommandItem>
              <Trello />
              <span>Pedidos</span>
            </CommandItem>
            <CommandItem>
              <NotepadText />
              <span>Gerenciar</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Administração">
            <CommandItem>
              <NotepadText />
              <span>Gerenciar</span>
              <CommandShortcut>⌘1</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Configurações</span>
              <CommandShortcut>⌘2</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Perfil">
            <CommandItem>
              <User />
              <span>Conta</span>
              <CommandShortcut>⌘3</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Assinaturas</span>
              <CommandShortcut>⌘4</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Bell />
              <span>Notificações</span>
              <CommandShortcut>⌘5</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
