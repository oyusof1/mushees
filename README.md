# Shroom Trip Web Portal

A psychedelic mushroom dispensary website with an admin system for managing menu items.

## Features

- **Interactive 3D Experience**: Psychedelic landing page with Three.js animations
- **Dynamic Menu Management**: Admin system to add, edit, and remove mushroom varieties
- **Authentication**: Secure admin access using Clerk
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Menu changes reflect immediately on the public site

## Project info

**URL**: https://lovable.dev/projects/e7f4246c-54fe-485e-aeb0-2bf1e23bd342

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e7f4246c-54fe-485e-aeb0-2bf1e23bd342) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Real-time Admin System with Supabase

This project includes a complete real-time admin system for managing mushroom menu items with **Supabase PostgreSQL database**.

### 🚀 **New Features:**
- ✅ **Real-time updates** across all devices and users
- ✅ **PostgreSQL database** with automatic backups
- ✅ **Multi-admin collaboration** 
- ✅ **Instant menu synchronization**
- ✅ **Row-level security** for data protection

### Quick Setup:

1. **Set up Clerk authentication** (see [ADMIN_SETUP.md](./ADMIN_SETUP.md))
2. **Set up Supabase database** (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
3. **Update your `.env` file** with both Clerk and Supabase credentials
4. **Run the database schema** in Supabase SQL Editor
5. **Start the dev server** and enjoy real-time admin features!

### 📚 **Detailed Guides:**
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Clerk authentication setup
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Database and real-time setup

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Frontend**: Vite, TypeScript, React
- **UI Components**: shadcn-ui, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Authentication**: Clerk
- **Forms**: React Hook Form, Zod validation
- **Routing**: React Router
- **State Management**: React Context + useReducer

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e7f4246c-54fe-485e-aeb0-2bf1e23bd342) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
