'use client'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

const FAQ_ITEMS = [
  {
    trigger: 'Tips from the CS Professors',
    content: (
      <ul className="list-disc list-inside">
        <li>
          The professors wrote{' '}
          <Link
            href="https://lmucs.github.io/resources/resources.html"
            className="text-lmublue hover:underline"
          >
            this!
          </Link>{' '}
          Really! Read it! It will help!
        </li>
      </ul>
    ),
  },
  {
    trigger:
      'Can I only contact the TA who grades for the class I have a question about?',
    content: (
      <ul className="list-disc list-inside">
        <li>
          No! CS TAs are general TAs, so you can ask any one of them for help.
        </li>
      </ul>
    ),
  },
  {
    trigger: 'When should I contact my professor vs. a TA?',
    content: (
      <ul className="list-disc list-inside">
        <li>
          Ask your professor if you have an assignment-specific question (i.e.
          “When is this assignment due?” or “How should I submit my answer?”).
        </li>
        <li>
          Ask a TA when you have a coding-specific or more general question
          (i.e. “I can’t figure out why I’m getting this output…”, “How would
          you approach solving this problem?”, or “I can’t wrap my head around
          this concept we learned.”)
        </li>
        <li>
          If you’re not sure, go ahead and ask a TA! They can redirect you to a
          professor if necessary
        </li>
      </ul>
    ),
  },
  {
    trigger: 'If I have further questions, where can I go?',
    content: (
      <ul className="list-disc list-inside">
        <li>
          If you have questions about the TA program that aren’t answered here,
          you can contact any of the TAs above at the email addresses listed as
          well as on Slack or Discord, or you can contact the lab manager, Masao
          Kitamura, at masao.kitamura@lmu.edu, or on Slack.
        </li>
      </ul>
    ),
  },
]

export default function FAQ() {
  return (
    <div className="motion-blur-in w-full h-full text-left flex flex-col md:flex-row gap-4 px-8 py-6">
      <div>
        <h1 className="text-4xl sm:text-5xl w-full md:w-64 text-lmublue font-[family-name:var(--font-metric-bold)] transition-all">
          Frequently Asked Questions
        </h1>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger className="text-xl">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
