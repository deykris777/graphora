import { useState } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useToast } from "./ToastProvider";

export const ProfileMenu = () => {
  const { user, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  if (!isSignedIn) {
    return (
      <Link
        to="/auth"
        className="rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm transition-all"
        style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
      >
        Sign In
      </Link>
    );
  }

  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Profile";

  const handleSignOut = async () => {
    addToast("Signed out", "success");
    await signOut();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all"
        style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--text-body)', border: '1px solid var(--accent-border)' }}
      >
        <img
          src={user?.imageUrl}
          alt={displayName}
          className="h-6 w-6 rounded-full object-cover"
          style={{ border: '1px solid var(--accent-border)' }}
        />
        <span className="max-w-[100px] truncate text-[11px]">{displayName}</span>
      </button>
      {open ? (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl p-2 text-sm shadow-xl backdrop-blur-xl z-50"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-mono" style={{ color: 'var(--text-muted)' }}>
            Account
          </div>
          <div className="px-3 pb-2 text-[11px] font-mono truncate" style={{ color: 'var(--text-faint)' }}>
            {user?.primaryEmailAddress?.emailAddress ?? ""}
          </div>
          <button
            type="button"
            onClick={() => { setOpen(false); openUserProfile(); }}
            className="w-full rounded-xl px-3 py-2 text-left text-[13px] transition-colors"
            style={{ color: 'var(--text-body)' }}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); void handleSignOut(); }}
            className="w-full rounded-xl px-3 py-2 text-left text-[13px] transition-colors"
            style={{ color: 'var(--badge-error-text)' }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
};
