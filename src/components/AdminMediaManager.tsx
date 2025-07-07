import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Save, Trash2, Plus, Eye, EyeOff, AlertCircle, CheckCircle, XCircle, Link, FileImage, Video } from 'lucide-react';
import { supabase, appId } from '../firebase/config';

interface AdminMediaManagerProps {
  onClose: () => void;
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  created_at: string;
  title?: string;
  category?: string;
  description?: string;
  youtubeUrl?: string;
  date?: string;
  mediatype: 'artwork' | 'video';
  isexternallink?: boolean;
  storagepath?: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
}

// Comprehensive file type validation
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mov',
  'video/avi',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/3gpp',
  'video/x-ms-wmv'
];

const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for videos

// Custom confirmation dialog component
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[150] p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md mx-4 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-400" size={24} />
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Upload progress component
const UploadProgress: React.FC<{ uploadState: UploadState }> = ({ uploadState }) => {
  if (uploadState.status === 'idle') return null;

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'uploading':
        return <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (uploadState.status) {
      case 'uploading':
        return 'border-blue-600 bg-blue-600 bg-opacity-20';
      case 'success':
        return 'border-green-600 bg-green-600 bg-opacity-20';
      case 'error':
        return 'border-red-600 bg-red-600 bg-opacity-20';
      default:
        return 'border-gray-600 bg-gray-600 bg-opacity-20';
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-2">
        {getStatusIcon()}
        <span className="text-white font-medium">
          {uploadState.status === 'uploading' && 'Uploading...'}
          {uploadState.status === 'success' && 'Upload Complete!'}
          {uploadState.status === 'error' && 'Upload Failed'}
        </span>
      </div>
      
      {uploadState.status === 'uploading' && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-300">{uploadState.progress.toFixed(1)}% complete</p>
        </div>
      )}
      
      {uploadState.message && (
        <p className="text-sm text-gray-300 mt-2">{uploadState.message}</p>
      )}
    </div>
  );
};

const AdminMediaManager: React.FC<AdminMediaManagerProps> = ({ onClose }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Media management state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'artwork' | 'video'>('artwork');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Upload method selection
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');

  // Enhanced upload state
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    status: 'idle',
    message: ''
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Form state for new media
  const [newMedia, setNewMedia] = useState({
    title: '',
    description: '',
    externalUrl: '',
    linkType: 'image' as 'image' | 'video',
    file: null as File | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setIsAuthenticated(false);
          return;
        }
        
        if (session) {
          setIsAuthenticated(true);
          console.log('User is authenticated:', session.user.email);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setIsAuthenticated(!!session);
      
      if (event === 'SIGNED_OUT') {
        setMediaItems([]);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Real-time listener for media items
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMediaItems = async () => {
      try {
        const { data, error } = await supabase
          .from('website_media')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching media items:', error);
          setError('Failed to load media items');
          return;
        }

        setMediaItems(data || []);
      } catch (error) {
        console.error('Error fetching media items:', error);
        setError('Failed to load media items');
      }
    };

    fetchMediaItems();

    // Set up real-time subscription
    const subscription = supabase
      .channel('website_media_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'website_media' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchMediaItems(); // Refresh the data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  // Authentication handler with Supabase
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        setError(`Login failed: ${error.message}`);
        setIsAuthenticated(false);
        return;
      }

      if (data.session) {
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
        console.log('Successfully authenticated with Supabase:', data.session.user.email);
      } else {
        setError('Login failed: No session returned');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred during login');
      setIsAuthenticated(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setIsAuthenticated(false);
      setMediaItems([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // File validation function
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `Unsupported file type: ${file.type}. Please select a valid image or video file.`
      };
    }

    // Check file size
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return {
        isValid: false,
        error: `Image file too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`
      };
    }
    
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return {
        isValid: false,
        error: `Video file too large. Maximum size is ${MAX_VIDEO_SIZE / (1024 * 1024)}MB.`
      };
    }

    return { isValid: true };
  };

  // URL validation function
  const validateUrl = (url: string): { isValid: boolean; error?: string } => {
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Please enter a valid URL'
      };
    }
  };

  // Reset upload state
  const resetUploadState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      status: 'idle',
      message: ''
    });
  };

  // Reset form
  const resetForm = () => {
    setNewMedia({
      title: '',
      description: '',
      externalUrl: '',
      linkType: 'image',
      file: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    resetUploadState();
  };

  // Enhanced file upload handler with progress tracking
  const handleFileUpload = async () => {
    if (!newMedia.file || !newMedia.title.trim()) {
      setError('Please provide a title and select a file');
      return;
    }

    // Validate file
    const validation = validateFile(newMedia.file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Reset any previous errors
    setError(null);
    
    // Initialize upload state
    setUploadState({
      isUploading: true,
      progress: 0,
      status: 'uploading',
      message: 'Starting upload...'
    });

    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedFileName = newMedia.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${activeTab}s/${timestamp}_${sanitizedFileName}`;

      console.log('Starting upload to Supabase Storage:', fileName);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, newMedia.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploadState({
          isUploading: false,
          progress: 0,
          status: 'error',
          message: `Upload failed: ${uploadError.message}`
        });
        setError(`Upload failed: ${uploadError.message}`);
        return;
      }

      console.log('Upload completed successfully:', uploadData);

      // Get public URL - CRITICAL FIX: Use the correct Supabase public URL format
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('Public URL obtained:', publicUrl);

      // Update progress
      setUploadState(prev => ({
        ...prev,
        progress: 100,
        message: 'Upload complete! Saving metadata...'
      }));

      // Determine media type based on file type
      const isImage = ALLOWED_IMAGE_TYPES.includes(newMedia.file.type);
      const mediaType = activeTab === 'artwork' ? 'artwork' : 'video';

      // Create media document in Supabase - CRITICAL FIX: Use lowercase column names
      const mediaDoc = {
        name: sanitizedFileName,
        url: publicUrl,
        type: newMedia.file.type,
        title: newMedia.title.trim(),
        description: newMedia.description.trim(),
        mediatype: mediaType, // lowercase
        isexternallink: false, // lowercase
        storagepath: fileName // lowercase
      };

      console.log('Saving to Supabase:', mediaDoc);
      
      const { error: insertError } = await supabase
        .from('website_media')
        .insert([mediaDoc]);

      if (insertError) {
        console.error('Database error:', insertError);
        setUploadState({
          isUploading: false,
          progress: 0,
          status: 'error',
          message: 'Upload completed but failed to save metadata. Please try again.'
        });
        setError('Failed to save media metadata. Please try again.');
        return;
      }

      // Success state
      setUploadState({
        isUploading: false,
        progress: 100,
        status: 'success',
        message: 'Media uploaded successfully!'
      });

      // Reset form after a short delay
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        status: 'error',
        message: 'Failed to upload. Please check your connection and try again.'
      });
      setError('Failed to upload. Please try again.');
    }
  };

  // Handle external link submission
  const handleLinkSubmission = async () => {
    if (!newMedia.externalUrl.trim() || !newMedia.title.trim()) {
      setError('Please provide a title and URL');
      return;
    }

    // Validate URL
    const validation = validateUrl(newMedia.externalUrl.trim());
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    // Reset any previous errors
    setError(null);
    
    // Initialize upload state
    setUploadState({
      isUploading: true,
      progress: 0,
      status: 'uploading',
      message: 'Saving link...'
    });

    try {
      // Determine media type based on selection and active tab
      const mediaType = activeTab === 'artwork' ? 'artwork' : 'video';
      const linkTypePrefix = newMedia.linkType === 'image' ? 'image' : 'video';

      // Create media document in Supabase - CRITICAL FIX: Use lowercase column names
      const mediaDoc = {
        name: newMedia.title.trim(),
        url: newMedia.externalUrl.trim(),
        type: `${linkTypePrefix}-link`,
        title: newMedia.title.trim(),
        description: newMedia.description.trim(),
        mediatype: mediaType, // lowercase
        isexternallink: true // lowercase
      };

      console.log('Saving external link to Supabase:', mediaDoc);
      
      const { error: insertError } = await supabase
        .from('website_media')
        .insert([mediaDoc]);

      if (insertError) {
        console.error('Database error:', insertError);
        setUploadState({
          isUploading: false,
          progress: 0,
          status: 'error',
          message: 'Failed to save link. Please try again.'
        });
        setError('Failed to save link. Please try again.');
        return;
      }

      // Success state
      setUploadState({
        isUploading: false,
        progress: 100,
        status: 'success',
        message: 'Link saved successfully!'
      });

      // Reset form after a short delay
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Link submission error:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        status: 'error',
        message: 'Failed to save link. Please try again.'
      });
      setError('Failed to save link. Please try again.');
    }
  };

  // Delete media handler
  const handleDeleteMedia = async (item: MediaItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Media',
      message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setIsDeleting(item.id);
        setError(null);

        try {
          // Delete from Supabase database first
          const { error: deleteError } = await supabase
            .from('website_media')
            .delete()
            .eq('id', item.id);

          if (deleteError) {
            console.error('Database deletion error:', deleteError);
            setError('Failed to delete media. Please try again.');
            return;
          }

          // If it's a file (not external link), delete from Storage
          if (!item.isexternallink && item.storagepath) {
            const { error: storageError } = await supabase.storage
              .from('media')
              .remove([item.storagepath]);

            if (storageError) {
              console.error('Storage deletion error:', storageError);
              // Don't show error for storage deletion as the database record is already gone
            }
          }

        } catch (error) {
          console.error('Error deleting media:', error);
          setError('Failed to delete media. Please try again.');
        } finally {
          setIsDeleting(null);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      }
    });
  };

  // Update media handler
  const handleUpdateMedia = async () => {
    if (!editingItem || !editingItem.title.trim()) {
      setError('Please provide a title');
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      status: 'uploading',
      message: 'Updating media...'
    });

    try {
      const updateData = {
        title: editingItem.title.trim(),
        description: editingItem.description?.trim() || ''
      };

      const { error: updateError } = await supabase
        .from('website_media')
        .update(updateData)
        .eq('id', editingItem.id);

      if (updateError) {
        console.error('Update error:', updateError);
        setUploadState({
          isUploading: false,
          progress: 0,
          status: 'error',
          message: 'Failed to update media. Please try again.'
        });
        setError('Failed to update media. Please try again.');
        return;
      }
      
      setUploadState({
        isUploading: false,
        progress: 100,
        status: 'success',
        message: 'Media updated successfully!'
      });
      
      setEditingItem(null);
      
      // Reset success state after delay
      setTimeout(() => {
        resetUploadState();
      }, 2000);

    } catch (error) {
      console.error('Error updating media:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        status: 'error',
        message: 'Failed to update media. Please try again.'
      });
      setError('Failed to update media. Please try again.');
    }
  };

  // Handle file selection with validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
        setNewMedia({ ...newMedia, file });
        setError(null);
        resetUploadState();
      } else {
        setError(validation.error || 'Invalid file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Filter media items by active tab
  const filteredItems = mediaItems.filter(item => item.mediatype === activeTab);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[120] p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 relative animate-in fade-in zoom-in duration-300 w-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={20} />
          </button>

          <h2 className="text-white text-2xl font-bold mb-6 text-center">Admin Access</h2>
          
          {error && (
            <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={isLoggingIn}
            />
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-600 pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoggingIn}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={isLoggingIn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={isLoggingIn || !email.trim() || !password.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>Note:</strong> You need to create an admin user in your Supabase project first. 
              Go to your Supabase dashboard → Authentication → Users to create an admin account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main admin interface
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[120] p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-800 rounded-2xl p-6 max-w-7xl mx-4 relative animate-in fade-in zoom-in duration-300 w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">Media Management Portal</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('artwork')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === 'artwork' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Artworks ({filteredItems.filter(item => item.mediatype === 'artwork').length})
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === 'video' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Videos ({filteredItems.filter(item => item.mediatype === 'video').length})
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(90vh-250px)]">
            {/* Media List */}
            <div className="xl:col-span-2 space-y-4">
              <h3 className="text-white text-lg font-semibold">
                Current {activeTab === 'artwork' ? 'Artworks' : 'Videos'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-xl p-4 group hover:bg-gray-650 transition-colors duration-200">
                    <div className="relative w-full h-32 bg-gray-600 rounded-lg overflow-hidden mb-3">
                      <img 
                        src={item.url} 
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      {/* Media type indicator */}
                      <div className="absolute top-2 left-2">
                        {item.isexternallink ? (
                          <Link className="w-4 h-4 text-blue-400" />
                        ) : (
                          item.type.startsWith('image') ? (
                            <FileImage className="w-4 h-4 text-green-400" />
                          ) : (
                            <Video className="w-4 h-4 text-purple-400" />
                          )
                        )}
                      </div>
                      {isDeleting === item.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold text-sm truncate">
                        {item.title || item.name}
                      </h4>
                      <p className="text-gray-500 text-xs truncate">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          {item.isexternallink ? 'External Link' : 'Uploaded File'}
                        </span>
                        {item.isexternallink && (
                          <span className="text-blue-400 text-xs">({item.type})</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-500 text-xs">
                          {item.type.split('/')[0]}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(item)}
                            disabled={isDeleting === item.id}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredItems.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">No {activeTab}s uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload/Edit Form */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'artwork' ? 'Artwork' : 'Video'}
              </h3>
              
              <div className="space-y-4 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                {/* Upload Progress */}
                <UploadProgress uploadState={uploadState} />

                {/* Upload Method Selection (only for new items) */}
                {!editingItem && (
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setUploadMethod('file')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                        uploadMethod === 'file' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Upload size={16} />
                      Upload File
                    </button>
                    <button
                      onClick={() => setUploadMethod('link')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                        uploadMethod === 'link' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Link size={16} />
                      Add Link
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Title *"
                  value={editingItem ? editingItem.title || '' : newMedia.title}
                  onChange={(e) => editingItem 
                    ? setEditingItem({ ...editingItem, title: e.target.value })
                    : setNewMedia({ ...newMedia, title: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <textarea
                  placeholder="Description"
                  value={editingItem ? editingItem.description || '' : newMedia.description}
                  onChange={(e) => editingItem 
                    ? setEditingItem({ ...editingItem, description: e.target.value })
                    : setNewMedia({ ...newMedia, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />

                {/* File Upload Section */}
                {!editingItem && uploadMethod === 'file' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadState.isUploading}
                      className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      Select {activeTab === 'artwork' ? 'Image' : 'Video'} File *
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={activeTab === 'artwork' ? 'image/*' : 'image/*,video/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {newMedia.file && (
                      <div className="text-sm text-gray-400 p-2 bg-gray-700 rounded">
                        <div className="flex items-center justify-between">
                          <span>Selected: {newMedia.file.name}</span>
                          <span className="text-xs">
                            {(newMedia.file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    )}

                    {/* File type help text */}
                    <div className="text-xs text-gray-500 p-2 bg-gray-750 rounded">
                      <p className="font-medium mb-1">Supported formats:</p>
                      <p>Images: JPG, PNG, GIF, WebP, SVG (max 10MB)</p>
                      <p>Videos: MP4, MOV, AVI, WebM (max 100MB)</p>
                    </div>
                  </div>
                )}

                {/* External Link Section */}
                {!editingItem && uploadMethod === 'link' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="External URL *"
                      value={newMedia.externalUrl}
                      onChange={(e) => setNewMedia({ ...newMedia, externalUrl: e.target.value })}
                      className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setNewMedia({ ...newMedia, linkType: 'image' })}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          newMedia.linkType === 'image' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Image Link
                      </button>
                      <button
                        onClick={() => setNewMedia({ ...newMedia, linkType: 'video' })}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          newMedia.linkType === 'video' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Video Link
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 p-2 bg-gray-750 rounded">
                      <p className="font-medium mb-1">Supported links:</p>
                      <p>Images: Direct image URLs, social media images</p>
                      <p>Videos: YouTube, Vimeo, direct video URLs</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={editingItem ? handleUpdateMedia : (uploadMethod === 'file' ? handleFileUpload : handleLinkSubmission)}
                    disabled={
                      uploadState.isUploading || 
                      !newMedia.title.trim() || 
                      (!editingItem && uploadMethod === 'file' && !newMedia.file) ||
                      (!editingItem && uploadMethod === 'link' && !newMedia.externalUrl.trim())
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {uploadState.isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingItem ? 'Updating...' : (uploadMethod === 'file' ? 'Uploading...' : 'Saving...')}
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        {editingItem ? 'Update' : (uploadMethod === 'file' ? 'Upload' : 'Save Link')}
                      </>
                    )}
                  </button>
                  
                  {editingItem && (
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        resetUploadState();
                      }}
                      disabled={uploadState.isUploading}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {!editingItem && (newMedia.file || newMedia.externalUrl) && (
                    <button
                      onClick={resetForm}
                      disabled={uploadState.isUploading}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </>
  );
};

export default AdminMediaManager;