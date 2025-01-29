'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { QuestionIcon } from '../icons/QuestionIcon'
import { DocumentIcon } from '../icons/DocumentIcon'
import { LinkIcon } from '../icons/LinkIcon'
import { PeopleIcon } from '../icons/PeopleIcon'
import { CalendarIcon } from '../icons/CalendarIcon'

const NAV_LIST_BUTTONS = [
  { label: 'Tutors', href: '/' },
  { label: 'Teaching', href: '/teaching' },
  {
    label: 'Real-time Display',
    href: 'https://tutor.lmucs.org/list',
    target: '_blank',
  },
  { label: 'FAQ', href: '/faq' },
  { label: 'Resources', href: '/resources' },
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Printing', href: '/print' },
  { label: 'Linktree', href: 'https://linktr.ee/lmucs', target: '_blank' },
  {
    label: 'Slack',
    href: 'https://lmucs.slack.com/',
    target: '_blank',
  },
  {
    label: 'Faculty',
    href: 'https://docs.google.com/presentation/d/e/2PACX-1vTdyFvGRqePNnh7nR4xhPoj1M95dK-fObFws4riRT3lGSzR3T4PGrqnKKbiL0LE9XEiwQEBlq7tWQR3/pub',
    target: '_blank',
  },
]

const NAV_MENU_BUTTONS = [
  {
    icon: <CalendarIcon />,
    label: 'Calendars',
    children: [
      {
        icon: <CalendarIcon />,
        label: 'TA Schedule',
        href: '/',
      },
      {
        icon: <CalendarIcon />,
        label: 'Teaching Schedule',
        href: '/teaching',
      },
      {
        icon: <CalendarIcon />,
        label: 'TA Real-time',
        href: 'https://tutor.lmucs.org/list',
      },
    ],
  },
  {
    label: 'Resources',
    icon: <QuestionIcon />,
    children: [
      {
        icon: <QuestionIcon />,
        label: 'FAQ',
        href: '/faq',
      },
      {
        icon: <DocumentIcon />,
        label: 'General Resources',
        href: '/resources',
      },
      {
        icon: <DocumentIcon />,
        label: 'Onboarding',
        href: '/onboarding',
      },
      {
        icon: <DocumentIcon />,
        label: 'Printing',
        href: '/print',
      },
    ],
  },
  {
    label: 'Links',
    icon: <LinkIcon />,
    children: [
      {
        icon: <LinkIcon />,
        label: 'Linktree',
        href: 'https://linktr.ee/lmucs',
      },
      {
        icon: <PeopleIcon />,
        label: 'Slack',
        href: 'https://lmucs.slack.com/',
      },
    ],
  },
]

const AppBar = () => {
  const pathname = usePathname()

  return (
    <div className="flex rounded-2xl py-2 justify-end">
      <nav className="hidden lg:flex">
        {NAV_LIST_BUTTONS.map(button => {
          const selected = button.href === pathname
          return (
            <Button
              key={button.label}
              variant="ghost"
              className="text-md rounded-xl"
              asChild
            >
              <Link
                href={button.href}
                className={`${
                  selected
                    ? 'underline decoration-lmublue decoration-2 underline-offset-4'
                    : ''
                }`}
                target={button.target}
              >
                {button.label}
              </Link>
            </Button>
          )
        })}
      </nav>
      <nav className="flex lg:hidden">
        <NavigationMenu>
          <NavigationMenuList>
            {NAV_MENU_BUTTONS.map(button => (
              <NavigationMenuItem key={button.label}>
                <NavigationMenuTrigger className="bg-background">
                  {button.icon}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background font-[family-name:var(--font-metric-regular)]">
                  <ul className="w-[224px]">
                    {button.children.map(child => (
                      <li key={child.label} className="p-2">
                        <NavigationMenuLink asChild>
                          <Button
                            variant="ghost"
                            className="w-full rounded-xl"
                            asChild
                          >
                            <Link
                              href={child.href}
                              className="flex items-center gap-2 text-left w-full"
                            >
                              {child.icon}
                              <span className="flex-1">{child.label}</span>
                            </Link>
                          </Button>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </div>
  )
}

export default AppBar
