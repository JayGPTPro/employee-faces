# Employee Faces

Your AI employees, with their faces on. When Claude Code works in your Donna folder, every reply opens with Donna's picture and name. In your Wonka folder, it's Wonka. The loading line talks like them too ("Knowing everything", "Stirring the chocolate river").

![Donna and Wonka labels](preview.png)

## Install

Open your Donna or Wonka folder in Claude Code and paste this into the chat:

```
Install this plugin: claude plugin marketplace add JayGPTPro/employee-faces, then claude plugin install employee-faces@employee-faces
```

Claude runs the two commands for you (it may ask you to approve once). Then open a new session. That's it.

Prefer the terminal? Run the same two commands yourself:

```
claude plugin marketplace add JayGPTPro/employee-faces
claude plugin install employee-faces@employee-faces
```

## How it knows whose folder you're in

It looks for the files that came with your kit: `.claude/donna-character.md` or `.claude/wonka-character.md`, or the opening of the kit's `CLAUDE.md`. Your folder can have any name. In any other folder, nothing changes.

## Where it shows

Claude Code in the desktop app, VS Code and the terminal. In a terminal that can't draw pictures you get an emoji instead of the face. It does not run on claude.ai chat or in Cowork.

## Update or remove

```
claude plugin update employee-faces@employee-faces
claude plugin uninstall employee-faces@employee-faces
```

Made by [Jay GPT Pro](https://jaygptpro.com) for members of the Donna Challenge and the Wonka Bootcamp.
