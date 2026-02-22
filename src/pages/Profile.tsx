import { useState } from 'react';
import { ArrowLeft, Pencil, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface ProfileData {
  name: string;
  email: string;
  password: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    password: 'securepass123',
  });

  const [draft, setDraft] = useState<ProfileData>(profile);

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setShowPassword(false);
  };

  const handleSaveClick = () => setShowSaveConfirm(true);

  const handleConfirmSave = () => {
    setProfile(draft);
    setEditing(false);
    setShowPassword(false);
    setShowSaveConfirm(false);
    toast.success('Profile updated');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    toast.success('Account deleted');
    navigate('/');
  };

  // Password strength
  const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-destructive', 'bg-orange-400', 'bg-yellow-400', 'bg-primary'];
  const pwStrength = getStrength(draft.password);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        {/* Back link */}
        <div className="max-w-[720px] mx-auto px-6 pt-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-[720px] mx-auto px-6 py-8"
        >
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-xl p-8 relative">
            {/* Avatar + Edit */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-primary/30 flex items-center justify-center text-4xl shadow-lg shadow-primary/20 cursor-pointer"
                >
                  🧑‍💻
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  title="Edit Profile"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                {editing ? (
                  <input
                    value={draft.name}
                    onChange={e => setDraft({ ...draft, name: e.target.value })}
                    className="mt-1.5 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={draft.email}
                    onChange={e => setDraft({ ...draft, email: e.target.value })}
                    className="mt-1.5 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground">{profile.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
                {editing ? (
                  <div className="mt-1.5 space-y-2">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={draft.password}
                        onChange={e => setDraft({ ...draft, password: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength indicator */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[0, 1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${i < pwStrength ? strengthColors[pwStrength - 1] : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{strengthLabels[Math.max(pwStrength - 1, 0)]}</span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1.5 text-foreground tracking-widest">••••••••</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <AnimatePresence>
              {editing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-3 mt-8"
                >
                  <button
                    onClick={handleSaveClick}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 active:scale-[0.97] transition-all"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete section */}
            <div className="mt-10 pt-6 border-t border-border">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-destructive/70 hover:text-destructive transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Confirmation */}
      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-md border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Profile</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to update your profile details?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-md border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent. Are you sure you want to delete your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
