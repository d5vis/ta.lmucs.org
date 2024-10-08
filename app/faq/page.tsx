import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FAQ() {
  return (
    <Card className="w-full h-full text-left gap-4 rounded-2xl p-8">
      <h2 className="text-xl font-[family-name:var(--font-metric-bold)]">
        Tips from the CS Professors
      </h2>
      <div>
        <ul className="list-disc list-inside">
          <li>
            The professors wrote{" "}
            <a href="https://lmucs.github.io/resources/resources.html">this!</a>{" "}
            Really! Read it! It will help!
          </li>
        </ul>
      </div>
      <Separator className="mt-4 mb-4" />
      <h2 className="text-xl font-[family-name:var(--font-metric-bold)]">
        Can I only contact the TA who grades for the class I have a question
        about?
      </h2>
      <div>
        <ul className="list-disc list-inside">
          <li>
            No! CS TAs are general TAs, so you can ask any one of them for help.
          </li>
        </ul>
      </div>
      <Separator className="mt-4 mb-4" />
      <h2 className="text-xl font-[family-name:var(--font-metric-bold)]">
        When should I contact my professor vs. a TA?
      </h2>
      <div>
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
            If you’re not sure, go ahead and ask a TA! They can redirect you to
            a professor if necessary
          </li>
        </ul>
      </div>
      <Separator className="mt-4 mb-4" />
      <h2 className="text-xl font-[family-name:var(--font-metric-bold)]">
        If I have further questions, where can I go?
      </h2>
      <div>
        <ul className="list-disc list-inside">
          <li>
            If you have questions about the TA program that aren’t answered
            here, you can contact any of the TAs above at the email addresses
            listed as well as on Slack or Discord, or you can contact the lab
            manager, Masao Kitamura, at masao.kitamura@lmu.edu, or on Slack.
          </li>
        </ul>
      </div>
    </Card>
  );
}
