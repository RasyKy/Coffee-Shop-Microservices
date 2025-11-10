# How to Work Together (Git Workflow)
To prevent breaking the project and losing work, we will follow a standard "feature branch" workflow.

## The Golden Rule
NEVER commit or push your code directly to the main branch. All work must be done on a separate branch and merged using a Pull Request.

## Your Daily Workflow (Step-by-Step)
Here is the process for starting and saving your work every day.

1. Start Your Day (Get Updates)
Before you write any code, get the latest version of the main branch.

```bash
# Switch to the main branch
git switch main

# Pull the latest changes from GitHub
git pull origin main
```

## Switch to the main branch
```bash
git switch main
```

## Pull the latest changes from GitHub
```
git pull origin main
```

2. Create Your New Branch
Create a new branch for the specific feature you are working on.

```bash
# Create a new branch and switch to it
# Example branch names: 'feat/user-login' or 'fix/product-card-bug'
git switch -c your-branch-name
```

3. Do Your Work
Now, you are on your own new branch. You can code, edit, and experiment safely without affecting anyone else.

When you're ready to save your progress, do the following:

```bash
# 1. Add your changed files to "staging"
git add .

# 2. Commit your changes with a clear message
git commit -m "Add login endpoint for user-service"

# 3. Push your new branch up to GitHub
git push -u origin your-branch-name
```

## 4. Merge Your Code (The "Pull Request")
When your feature is finished and working, it's time to merge it into main.

Go to the project's GitHub page.

You will see a banner: "Your-branch-name had recent pushes." Click the "Compare & pull request" button.

Give your Pull Request (PR) a clear title (e.g., "Feature: User Login") and a description of what you did.

Assign at least one other teammate to review your code.

Once your PR is approved by a teammate, you can click the "Merge pull request" button.

Your code is now part of main, and everyone else can git pull to get your new feature!