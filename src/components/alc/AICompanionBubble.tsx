interface AICompanionBubbleProps {
  message: string
  emoji?: string
}

export function AICompanionBubble({ message, emoji = "🦋" }: AICompanionBubbleProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-3xl flex-shrink-0 mt-1" aria-hidden="true">
        {emoji}
      </div>
      <div className="vs-ai-bubble flex-1">
        <p className="text-sm leading-relaxed" style={{ color: "#2D1B35" }}>
          {message}
        </p>
      </div>
    </div>
  )
}
