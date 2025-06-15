'use client'
import { getAuthUserDetails } from '@/lib/queries'
import { SubAccount, User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon, Sparkles, Zap } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import Link from 'next/link'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import SubAccountDetails from '../forms/subaccount-details'
import { Separator } from '../ui/separator'
import { icons } from '@/lib/constants'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: any[]
  sidebarLogo: string
  details: any
  user: any
  id: string
}

const MenuOptions = ({
  defaultOpen,
  subAccounts,
  sidebarOpt,
  sidebarLogo,
  details,
  user,
  id,
}: Props) => {
  const { setOpen } = useModal()
  const [isMounted, setIsMounted] = useState(false)

  const openState = defaultOpen ? { open: true } : {}

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return

  return (
    <Sheet
      modal={false}
      {...openState}
    >
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button
          variant="outline"
          size={'icon'}
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side={'left'}
        className={clsx(
          'bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl border-r border-border/50 fixed top-0 border-none p-6 shadow-2xl',
          {
            'hidden md:inline-block z-0 w-[300px]': defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen,
          }
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="flex flex-col space-y-6">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-border/30 shadow-inner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AspectRatio ratio={16 / 5}>
                <Image
                  src={sidebarLogo}
                  alt="Sidebar Logo"
                  fill
                  className="rounded-lg object-contain"
                />
              </AspectRatio>
            </motion.div>

            {/* Account Selector */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="w-full justify-between bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border border-border/30 rounded-xl h-12 transition-all duration-300 hover:shadow-lg group"
                    variant="ghost"
                  >
                    <div className="flex items-center text-left gap-3">
                      <div className="w-8 h-8 relative">
                        <Image
                          src={details.agencyLogo || details.subAccountLogo}
                          alt="Account Logo"
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[140px]">
                          {details.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {details.address}
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 border-border/50 shadow-2xl">
                  <Command className="rounded-xl">
                    <CommandInput 
                      placeholder="Search account..." 
                      className="border-none focus:ring-0"
                    />
                    <CommandList className="max-h-[300px]">
                      <CommandEmpty>No results found.</CommandEmpty>
                      {(user?.role === 'AGENCY_OWNER' ||
                        user?.role === 'AGENCY_ADMIN') &&
                        user?.Agency && (
                          <CommandGroup heading="Agency">
                            <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-3 rounded-lg hover:!bg-muted cursor-pointer transition-all">
                              {defaultOpen ? (
                                <Link
                                  href={`/agency/${user?.agencyId?.id}`}
                                  className="flex gap-4 w-full h-full"
                                >
                                  <div className="relative w-10 h-10">
                                    <Image
                                      src={user?.agencyId?.agencyLogo}
                                      alt="Agency Logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <span className="font-medium">
                                      {user?.agencyId?.name}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                      {user?.agencyId?.address}
                                    </span>
                                  </div>
                                </Link>
                              ) : (
                                <SheetClose asChild>
                                  <Link
                                    href={`/agency/${user?.agencyId?.id}`}
                                    className="flex gap-4 w-full h-full"
                                  >
                                    <div className="relative w-10 h-10">
                                      <Image
                                        src={user?.Agency?.agencyLogo}
                                        alt="Agency Logo"
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      <span className="font-medium">
                                        {user?.agencyId?.name}
                                      </span>
                                      <span className="text-muted-foreground text-xs">
                                        {user?.agencyId?.address}
                                      </span>
                                    </div>
                                  </Link>
                                </SheetClose>
                              )}
                            </CommandItem>
                          </CommandGroup>
                        )}
                      <CommandGroup heading="Accounts">
                        {!!subAccounts
                          ? subAccounts.map((subaccount) => (
                              <CommandItem
                                key={subaccount.id}
                                className="!bg-transparent my-2 text-primary border-[1px] border-border p-3 rounded-lg hover:!bg-muted cursor-pointer transition-all"
                              >
                                {defaultOpen ? (
                                  <Link
                                    href={`/subaccount/${subaccount.id}`}
                                    className="flex gap-4 w-full h-full"
                                  >
                                    <div className="relative w-10 h-10">
                                      <Image
                                        src={subaccount.subAccountLogo}
                                        alt="Subaccount Logo"
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      <span className="font-medium">
                                        {subaccount.name}
                                      </span>
                                      <span className="text-muted-foreground text-xs">
                                        {subaccount.address}
                                      </span>
                                    </div>
                                  </Link>
                                ) : (
                                  <SheetClose asChild>
                                    <Link
                                      href={`/subaccount/${subaccount.id}`}
                                      className="flex gap-4 w-full h-full"
                                    >
                                      <div className="relative w-10 h-10">
                                        <Image
                                          src={subaccount.subAccountLogo}
                                          alt="Subaccount Logo"
                                          fill
                                          className="rounded-md object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col flex-1">
                                        <span className="font-medium">
                                          {subaccount.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                          {subaccount.address}
                                        </span>
                                      </div>
                                    </Link>
                                  </SheetClose>
                                )}
                              </CommandItem>
                            ))
                          : 'No Accounts'}
                      </CommandGroup>
                    </CommandList>
                    {(user?.role === 'AGENCY_OWNER' ||
                      user?.role === 'AGENCY_ADMIN') && (
                      <div className="p-2 border-t border-border/50">
                        <SheetClose>
                          <Button
                            className="w-full flex gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => {
                              setOpen(
                                <CustomModal
                                  title="Create A Subaccount"
                                  subheading="You can switch between subaccounts"
                                >
                                  <SubAccountDetails
                                    agencyDetails={user?.Agency}
                                    userId={user?.id}
                                    userName={user?.name}
                                  />
                                </CustomModal>
                              )
                            }}
                          >
                            <PlusCircleIcon size={15} />
                            Create Sub Account
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </motion.div>

            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Navigation Menu */}
          <nav className="relative flex-1 overflow-y-auto">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {sidebarOpt.map((link, index) => {
                let val
                const result = icons.find((icon) => icon.value === link.icon)
                if (result) {
                  val = <result.path />
                }
                
                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {defaultOpen ? (
                      <Link
                        href={link.link}
                        className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          {val}
                        </div>
                        <span className="group-hover:text-primary transition-colors duration-300">
                          {link.name}
                        </span>
                        {link.name === 'Pipelines' && (
                          <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-primary/20 to-accent/20 text-xs">
                            New
                          </Badge>
                        )}
                      </Link>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          href={link.link}
                          className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                            {val}
                          </div>
                          <span className="group-hover:text-primary transition-colors duration-300">
                            {link.name}
                          </span>
                          {link.name === 'Pipelines' && (
                            <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-primary/20 to-accent/20 text-xs">
                              New
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </nav>

          {/* Footer Section */}
          <motion.div 
            className="mt-auto pt-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
                </div>
                <p className="text-lg font-bold text-green-800 dark:text-green-300">
                  {subAccounts?.length || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Projects</span>
                </div>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                  {sidebarOpt?.length || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions