import { useState } from 'react';
import { ArrowLeft, Pencil, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/ui/custom-toast';
import Navbar from '@/components/Navbar';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [profile, setProfile] = useState({ name: 'Alex Morgan', email: 'alex.morgan@email.com' });
  const [draft, setDraft] = useState(profile);

  // Change password
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleEdit = () => { setDraft(profile); setEditing(true); };
  const handleCancel = () => setEditing(false);
  const handleSaveClick = () => setShowSaveConfirm(true);

  const handleConfirmSave = () => {
    setProfile(draft);
    setEditing(false);
    setShowSaveConfirm(false);
    showToast('Profile updated successfully.', 'success');
  };

  const handlePasswordSubmit = () => {
    setPwError('');
    if (!newPw || !confirmPw) { setPwError('Both fields are required.'); showToast('Both fields are required.', 'error'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); showToast('Passwords do not match.', 'error'); return; }
    setShowPwConfirm(true);
  };

  const handleConfirmPassword = () => {
    setShowPwConfirm(false);
    setNewPw(''); setConfirmPw(''); setPwError('');
    showToast('Password updated successfully.', 'success');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    showToast('Account deleted successfully.', 'success');
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        {/* Back */}
        <div className="max-w-[720px] mx-auto px-6 pt-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[720px] mx-auto px-6 py-8">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border bg-[hsl(var(--card)/0.6)] backdrop-blur-md shadow-xl p-8">
            {/* Avatar + Edit */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-primary/30 flex items-center justify-center text-4xl shadow-lg shadow-primary/20 cursor-pointer">
                  🧑‍💻
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              {!editing && (
                <button onClick={handleEdit} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Edit Profile">
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                {editing ? (
                  <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="mt-1.5 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                ) : (
                  <p className="mt-1.5 text-foreground">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                {editing ? (
                  <input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} className="mt-1.5 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                ) : (
                  <p className="mt-1.5 text-foreground">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Edit buttons */}
            <AnimatePresence>
              {editing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex gap-3 mt-8">
                  <button onClick={handleSaveClick} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all">Save Changes</button>
                  <button onClick={handleCancel} className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 active:scale-[0.97] transition-all">Cancel</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Change Password Card */}
          <div className="rounded-2xl border border-border bg-[hsl(var(--card)/0.6)] backdrop-blur-md shadow-xl p-8 mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</label>
                <div className="relative mt-1.5">
                  <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => { setNewPw(e.target.value); setPwError(''); }} className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                <div className="relative mt-1.5">
                  <input type={showConfirmPw ? 'text' : 'password'} value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setPwError(''); }} className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {pwError && <p className="text-sm text-destructive">{pwError}</p>}
              <button onClick={handlePasswordSubmit} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all">Update Password</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-border bg-[hsl(var(--card)/0.6)] backdrop-blur-md shadow-xl p-8 mt-6">
            <div className="border-t border-border pt-6">
              <button onClick={() => setShowDeleteConfirm(true)} className="text-sm text-destructive/70 hover:text-destructive transition-colors">
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

      {/* Password Confirmation */}
      <AlertDialog open={showPwConfirm} onOpenChange={setShowPwConfirm}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-md border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to change your password?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPassword}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-md border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>This action is permanent. Are you sure you want to delete your account?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
