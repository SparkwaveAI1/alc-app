with open('src/app/api/chat/route.ts', 'r') as f:
    content = f.read()

# Add wikiContext block after the Bryson section (after "Once ${name} is engaged..." line)
wiki_block = '''
const wikiContext = Array.isArray(learner_wiki) && learner_wiki.length > 0
 ? `\\nThe student's learning wiki contains these modules they've already explored: ${learner_wiki.join(', ')}.
When you notice a genuine connection between what you're discussing and something in their wiki, surface it naturally: "You actually explored something related to this when you studied [topic] — do you remember what the connection might be?"
Only do this when the connection is real and interesting. Don't force it.`
 : ''

'''

old = "Once \\${name} is engaged and contextualized, shift to clarity and precision for practice or procedures.\\n\\nCurrent topic"
new = "Once \\${name} is engaged and contextualized, shift to clarity and precision for practice or procedures.\\n\\n" + wiki_block + "\\nCurrent topic"

content = content.replace(old, new)

# Add ${wikiContext} to the system prompt template
old2 = "Make facts unforgettable by wrapping them in story.\\`"
new2 = "Make facts unforgettable by wrapping them in story.\\${wikiContext}\\`"
content = content.replace(old2, new2)

with open('src/app/api/chat/route.ts', 'w') as f:
    f.write(content)

print("done")
