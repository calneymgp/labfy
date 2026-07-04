import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

type Comment = {
  author: string;
  time: string;
  body: string;
  replies?: Comment[];
};

const thread: Comment[] = [
  {
    author: "calney",
    time: "há 2h",
    body: "Alguém já testou o novo fluxo de OTP em produção? Achei o código bem mais rápido de digitar que um magic link.",
    replies: [
      {
        author: "beta.tester",
        time: "há 1h",
        body: "Testei sim — chegou em menos de 5s pelo Resend. Só senti falta de reenviar sem trocar de tela.",
      },
    ],
  },
  {
    author: "labfy.dev",
    time: "há 40min",
    body: "Boa observação, já tem um botão de reenviar na tela de código 🙂",
  },
];

function CommentItem({ comment, nested = false }: { comment: Comment; nested?: boolean }) {
  return (
    <div className={nested ? "ml-10 border-l border-border pl-4" : ""}>
      <div className="flex gap-3">
        <Avatar size="sm">
          <AvatarImage src="" alt={comment.author} />
          <AvatarFallback className="font-mono text-[10px] uppercase">
            {comment.author.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium">{comment.author}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{comment.time}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{comment.body}</p>
          <button className="flex items-center gap-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase hover:text-foreground">
            <MessageSquare className="h-3 w-3" />
            Responder
          </button>
        </div>
      </div>
      {comment.replies?.map((reply, i) => (
        <div key={i} className="mt-3">
          <CommentItem comment={reply} nested />
        </div>
      ))}
    </div>
  );
}

export function CommentThread() {
  return (
    <div className="space-y-4">
      {thread.map((comment, i) => (
        <CommentItem key={i} comment={comment} />
      ))}
    </div>
  );
}
